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
                    console.log(err.toString());
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
                contests = res.body.results;
                contests.should.be.an('array').not.empty
                done();
            });
        });
        it('should show only upcoming contests when status=upcoming', (done) => {
            // TODO: Improve this
            chai.request(server).get('/').query({'status': 'upcoming'}).end((err, res) => {
                contests = res.body.results;
                contests.should.be.an('array').not.empty
                done();
            });
        });
    });
});
