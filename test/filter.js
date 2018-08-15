/* jshint expr: true */

process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const should = chai.should();

chai.use(chaiHttp);
describe('filter', () => {
  describe('by platform', () => {
    it("should only show given platform's contests", (done) => {
      const platform = 'hackerearth';
      chai.request(server).get('/').query({ platform }).end((err, res) => {
        if (err) {
          console.error(err.toString());
          done();
        }
        const contests = res.body.results;
        contests.ongoing.filter(contest => contest.platform != platform).should.be.an('array').that.is.empty;

        contests.upcoming.filter(contest => contest.platform != platform).should.be.an('array').that.is.empty;
        done();
      });
    });
  });

  describe('by status', () => {
    it('should show only ongoing contests when status=ongoing', (done) => {
      // TODO: Improve this
      chai.request(server).get('/').query({ status: 'ongoing' }).end((err, res) => {
        if (err) {
          console.error(err.toString());
          done();
        }
        const contests = res.body.results;
        const cur_time = new Date().getTime() / 1000;

        // remove all contests that are ongoing. The result should be empty.
        contests.filter(contest => (contest.start_time > cur_time
                        || (contest.start_time + contest.duration) < cur_time)).should.be.an('array').that.is.empty;
        done();
      });
    });
    it('should show only upcoming contests when status=upcoming', (done) => {
      // TODO: Improve this
      chai.request(server).get('/').query({ status: 'upcoming' }).end((err, res) => {
        if (err) {
          console.error(err.toString());
          done();
        }
        const contests = res.body.results;
        const cur_time = new Date().getTime() / 1000;

        // remove all contests that are upcoming. The result should be empty.
        contests.filter(contest => (contest.start_time < cur_time)).should.be.an('array').that.is.empty;
        done();
      });
    });
  });
});
