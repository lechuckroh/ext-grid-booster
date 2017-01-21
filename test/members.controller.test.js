'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Code = require('code');
const expect = Code.expect;
const server = require('../src/server');
const models = require('../src/models/index');
const ModelHelper = require('../src/models/modelHelper');
const Member = models.Member;
const Team = models.Team;
const TestHelper = require('./testHelper');

const newMember = function (i, teamId) {
    return {
        name: `member${i}`,
        address: `addr${i}`,
        teamId: teamId,
        age: 10 + i % 50
    };
};

const newTeam = function (i) {
    return {
        name: `team${i}`,
        alias: `${i}`
    };
};

lab.experiment("Members", () => {
    lab.before(done => {
        ModelHelper
            .sync([Member, Team], {force: true})
            .then(() => done())
            .catch(err => done(err));
    });

    lab.beforeEach(done => {
        ModelHelper
            .deleteAll([Member, Team])
            .then(() => done())
            .catch(err => done(err));
    });


    lab.test("ORM", done => {
        const memberCount = 10;
        const start = 2;
        const limit = 3;
        const callback = 'cb';

        // add Team
        Team.create(newTeam(1)).then(team => {
            // add Members
            const members = [];
            for (let i = 1; i <= memberCount; i++) {
                members.push(newMember(i, team.id));
            }

            return Member.bulkCreate(members);
        }).then(() => {
            // get inserted members
            return Member.findAll();
        }).then(members => {
            // expected text
            const expectedData = {
                total: members.length,
                data: members.slice(start, start + limit)
            };
            const expectedText =
                `${callback}(${JSON.stringify(expectedData)});`;

            // send request
            const query = TestHelper.toQueryStr({start, limit, callback});
            const options = {
                method: 'GET',
                url: `/api/members?${query}`
            };

            server.inject(options, res => {
                // test
                TestHelper.logResponse(res);
                expect(res.statusCode).to.equal(200);
                expect(res.result).to.equal(expectedText);
                done();
            });
        }).catch(err => {
            console.error(err.stack);
            server.stop(done);
        });
    });

    lab.test("Sqlite native query", done => {
        const memberCount = 10;
        const start = 2;
        const limit = 3;
        const sort = JSON.stringify([{
            property: 'id',
            direction: 'ASC'
        }]);
        const callback = 'cb';

        let team = null;

        // add Team
        Team.create(newTeam(1)).then(t => {
            // add Members
            const members = [];
            team = t;
            for (let i = 1; i <= memberCount; i++) {
                members.push(newMember(i, t.id));
            }

            return Member.bulkCreate(members);
        }).then(() => {
            // get inserted members
            return Member.findAll();
        }).then(rows => {
            // transform Member
            // - add teamName
            // - remove teamId
            const members = rows.map(row => {
                const member = Object.assign({}, row.dataValues);
                delete member.teamId;
                member.teamName = team.name;
                return member;
            });

            // expected text
            const expectedData = {
                total: members.length,
                data: members.slice(start, start + limit)
            };
            const expectedText =
                `${callback}(${JSON.stringify(expectedData)});`;

            // send request
            const query = TestHelper.toQueryStr({start, limit, sort, callback});
            const options = {
                method: 'GET',
                url: `/api/members/sqlite?${query}`
            };

            server.inject(options, res => {
                // test
                TestHelper.logResponse(res);
                expect(res.statusCode).to.equal(200);
                expect(res.result).to.equal(expectedText);
                done();
            });
        }).catch(err => {
            console.error(err.stack);
            server.stop(done);
        });
    });
});