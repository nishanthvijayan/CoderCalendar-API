/*jshint expr: true*/

process.env.NODE_ENV = 'test';
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();

chai.use(chaiHttp);
describe('filter', () => {
    describe('by platform', () => {
        it("should only show given platform's contests", (done) => {
            var platform = "hackerearth";
            chai.request(server).get('/').query({'platform': platform}).end((err, res) => {
                if(err){
                    console.error(err.toString());
                    done();
                }
                var contests = res.body.results;
                contests.ongoing.filter(function(contest){
                    return contest.platform != platform;
                }).should.be.an('array').that.is.empty;

                contests.upcoming.filter(function(contest){
                    return contest.platform != platform;
                }).should.be.an('array').that.is.empty;
                done();
            });
        });
    });

    describe('by status', () => {
        it('should show only ongoing contests when status=ongoing', (done) => {
            // TODO: Improve this
            chai.request(server).get('/').query({'status': 'ongoing'}).end((err, res) => {
                if(err){
                    console.error(err.toString());
                    done();
                }
                var contests = res.body.results;
                var cur_time = new Date().getTime()/1000;

                // remove all contests that are ongoing. The result should be empty.
                contests.filter(function(contest){
                    return (contest.start_time > cur_time ||
                        (contest.start_time + contest.duration) < cur_time);
                }).should.be.an('array').that.is.empty;
                done();
            });
        });
        it('should show only upcoming contests when status=upcoming', (done) => {
            // TODO: Improve this
            chai.request(server).get('/').query({'status': 'upcoming'}).end((err, res) => {
                if(err){
                    console.error(err.toString());
                    done();
                }
                var contests = res.body.results;
                var cur_time = new Date().getTime()/1000;

                // remove all contests that are upcoming. The result should be empty.
                contests.filter(function(contest){
                    return (contest.start_time < cur_time);
                }).should.be.an('array').that.is.empty;
                done();
            });
        });
    });
});
