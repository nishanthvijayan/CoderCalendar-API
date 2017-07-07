// This test tests compliance with the current API's results

process.env.NODE_ENV = 'test';
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var axios = require("axios");
var should = chai.should();


var compare_with_legacy = (results, legacy_results, platform, done) => {
    var n_platform_contests_upcoming = results.upcoming.filter((contest) => {
      return contest.platform == platform;
    }).length;
    var n_platform_contests_ongoing = results.ongoing.filter((contest) => {
      return contest.platform == platform;
    }).length;
    
    var n_platform_contests_upcoming_legacy = legacy_results.upcoming.filter((contest) => {
      return contest.Platform == platform.toUpperCase();
    }).length;
    var n_platform_contests_ongoing_legacy = legacy_results.ongoing.filter((contest) => {
      return contest.Platform == platform.toUpperCase();
    }).length;

    n_platform_contests_ongoing.should.be.eql(n_platform_contests_ongoing_legacy);
    n_platform_contests_upcoming.should.be.eql(n_platform_contests_upcoming_legacy);

    done();
};


chai.use(chaiHttp);
describe('root', () => {
    var results, legacy_results;
    before((done) => {
        axios.get("http://contesttrackerapi.herokuapp.com/", {timeout: 15000})
            .then((response) =>{
                legacy_results = response.data.result;
                chai.request(server).get('/').end((err, res) => {
                    results = res.body.results;
                    done();
                });
            }); 
    });

    describe('Hackerearth parser', () => {
        it('should fetch all Codechef contests', (done) => {
            compare_with_legacy(results, legacy_results, 'hackerearth', done);
        });
    });

    describe('Hackerrank parser', () => {
        it('should fetch all Hackerrank contests', (done) => {
            compare_with_legacy(results, legacy_results, 'hackerrank', done);
        });
    });

    describe('Topcoder parser', () => {
        it('should fetch all Topcoder contests', (done) => {
            compare_with_legacy(results, legacy_results, 'topcoder', done);
        });
    });

    describe('Codeforces parser', () => {
        it('should fetch all Codeforces contests', (done) => {
            compare_with_legacy(results, legacy_results, 'codeforces', done);
        });
    });

    describe('Codechef parser', () => {
        it('should fetch all Codechef contests', (done) => {
            compare_with_legacy(results, legacy_results, 'codechef', done);
        });
    });

});
