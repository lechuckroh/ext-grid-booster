'use strict';

const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Code = require('code');
const expect = Code.expect;
const fail = Code.fail;

const root = '../..';
const config = require(`${root}/src/config`);
const server = require(`${root}/src/server`).httpServer;
const routes = require(`${root}/src/routes`);
const ModelHelper = require(`${root}/src/models/model_helper`);
const TestHelper = require(`${root}/test/test_helper`);

// add models for test
const models = require(`${root}/src/models/index`);
models.scanDir(__dirname + '/../models');
const Member = models.Member;
const Team = models.Team;

// register routes for test
const members = require(`${root}/test/controllers/members`);
routes.routeGet(server, '/api/members', members.select);
routes.routeGet(server, '/api/members/sqlite', members.selectNative);


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

const json = obj => JSON.stringify(obj);
const logging = !!config['queryLogging'];

lab.experiment("Members", () => {
    lab.before(done => {
        ModelHelper
            .sync([Member, Team], {force: true, logging})
            .then(() => done())
            .catch(err => done(err));
    });

    lab.beforeEach(done => {
        ModelHelper
            .deleteAll([Member, Team], {logging})
            .then(() => done())
            .catch(err => done(err));
    });


    lab.test("ORM", done => {
        const memberCount = 10;
        const start = 2;
        const limit = 3;
        const callback = 'cb';

        // add Team
        Team.create(newTeam(1), {logging}).then(team => {
            // add Members
            const members = [];
            for (let i = 1; i <= memberCount; i++) {
                members.push(newMember(i, team.id));
            }

            return Member.bulkCreate(members, {logging});
        }).then(() => {
            // get inserted members
            return Member.findAll({logging});
        }).then(members => {
            // expected text
            const expectedData = {
                total: members.length,
                data: members.slice(start, start + limit)
            };
            const expectedText = `${callback}(${json(expectedData)});`;

            // send request
            const query = TestHelper.toQueryStr({start, limit, callback});
            const options = {
                method: 'GET',
                url: `/api/members?${query}`
            };

            server.inject(options, res => {
                // test
                if (logging) {
                    TestHelper.logResponse(res);
                }
                expect(res.statusCode).to.equal(200);
                expect(res.result).to.equal(expectedText);
                done();
            });
        }).catch(err => {
            console.error(err.stack);
            server.stop(done, () => fail(err.message));
        });
    });

    lab.test("Sqlite native query", done => {
        const memberCount = 10;
        const start = 2;
        const limit = 3;
        const sort = json([{
            property: 'id',
            direction: 'ASC'
        }]);
        const callback = 'cb';

        let team = null;

        // add Team
        Team.create(newTeam(1), {logging}).then(t => {
            // add Members
            const members = [];
            team = t;
            for (let i = 1; i <= memberCount; i++) {
                members.push(newMember(i, t.id));
            }

            return Member.bulkCreate(members, {logging});
        }).then(() => {
            // get inserted members
            return Member.findAll({logging});
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
            const expectedText = `${callback}(${json(expectedData)});`;

            // send request
            const query = TestHelper.toQueryStr({start, limit, sort, callback});
            const options = {
                method: 'GET',
                url: `/api/members/sqlite?${query}`
            };

            server.inject(options, res => {
                // test
                if (logging) {
                    TestHelper.logResponse(res);
                }
                expect(res.statusCode).to.equal(200);
                expect(res.result).to.equal(expectedText);
                done();
            });
        }).catch(err => {
            console.error(err.stack);
            server.stop(done, () => fail(err.message));
        });
    });
});
