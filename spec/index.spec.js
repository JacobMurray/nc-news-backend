process.env.NODE_ENV = "test";
const app = require("../app");
const { expect } = require("chai");
const mongoose = require("mongoose");
const request = require("supertest")(app);
const seedDB = require("../seed/seed");
const {
  articleData,
  commentsData,
  topicsData,
  userData
} = require("../seed/testData");

describe("/api", () => {
  let article, comment, topic, user;
  beforeEach(() => {
    return seedDB(articleData, commentsData, topicsData, userData).then(
      docs => {
        [article, comment, topic, user] = docs;
      }
    );
  });
  after(() => {
    return mongoose.disconnect();
  });
  describe("/topics", () => {
    it("GET returns 200 and the topics", () => {
      return request
        .get(`/api/topics`)
        .expect(200)
        .then(res => {
          expect(res.body.topic[0].title).to.equal("Mitch");
        });
    });
  });
  describe("/topics/:", () => {
    it("GET returns 200 and the articles", () => {
      return request
        .get(`/api/topics/mitch/articles`)
        .expect(200)
        .then(res => {
          expect(res.body.article[0].title).to.equal(
            `Living in the shadow of a great man`
          );
        });
    });
    it("GET returns 400 and message bad request", () => {
      return request.get(`/api/topics/rabbits/articles`).expect(404);
    });
    it("POST returns 200 and the posted artcle", () => {
      return request
        .post(`/api/topics/mitch/articles`)
        .send({
          title: "creating a post request",
          created_by: user._id,
          body: "hello"
        })
        .expect(201)
        .then(res => {
          expect(res.body[0].title).to.equal("creating a post request");
        });
    });
    it("POST returns 400 and a error message", () => {
      return request
        .post(`/api/topics/mitch/articles`)
        .send({
          title: "creating a post request",
          created_by: user._id
        })
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(
            "articles validation failed: body: Path `body` is required."
          );
        });
    });
  });
  describe("articles", () => {
    it("GET returns 200 and the articles", () => {
      return request
        .get(`/api/articles`)
        .expect(200)
        .then(res => {
          expect(res.body.article[0].title).to.equal(
            "Living in the shadow of a great man"
          );
        });
    });
  });
  describe("articles/:article_id", () => {
    it("GET returns 200 and the single article", () => {
      return request
        .get(`/api/articles/${article._id}`)
        .expect(200)
        .then(res => {
          expect(res.body.article[0].title).to.equal(
            "Living in the shadow of a great man"
          );
        });
    });
    it("GET returns 404 and a error message", () => {
      return request
        .get(`/api/articles/${comment._id}`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal("That article doesnt exist");
        });
    });
    it("GET returns 400 and a error message", () => {
      return request
        .get(`/api/articles/hello`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(
            'Cast to ObjectId failed for value "hello" at path "_id" for model "articles"'
          );
        });
    });
  });
  describe("articles/:article_id/comments", () => {
    it("Get 200 aand the comments for that article", () => {
      return request
        .get(`/api/articles/${article._id}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body.comments[0].body).to.equal(comment.body);
        });
    });
    it("Get 404 and ERROR message", () => {
      return request
        .get(`/api/articles/${topic._id}/comments`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal("That article doesnt exist");
        });
    });
    it("GET returns 400 and a error message", () => {
      return request
        .get(`/api/articles/hello/comments`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(
            'Cast to ObjectId failed for value "hello" at path "_id" for model "articles"'
          );
        });
    });
    it("POST returns 201 and the comment that was posted", () => {
      return request
        .post(`/api/articles/${article._id}/comments`)
        .send({
          title: "dwiu",
          created_by: user._id,
          body: "hello"
        })
        .expect(201)
        .then(res => {
          expect(res.body.comment[0].body).to.equal('hello');
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    it("PATCH returns 200 and the articles", () => {
      return request
        .patch(`/api/articles/${article._id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body.article.votes).to.equal(article.votes +1);
        });
    });
    it("PATCH returns 404 and error message", () => {
      return request
        .patch(`/api/articles/${topic._id}?vote=up`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('That article doesnt exist');
        });
    });
    it("PATCH returns 400 and error message", () => {
      return request
        .patch(`/api/articles/word?vote=up`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Cast to ObjectId failed for value "word" at path "_id" for model "articles"');
        });
    });
  });
  describe('/api/comments/:comment_id', () => {
    it("PATCH returns 200 and the articles", () => {
      return request
        .patch(`/api/comments/${comment._id}?vote=up`)
        .expect(200)
        .then(res => {
          expect(res.body.comment.votes).to.equal(comment.votes +1);
        });
    });
    it("PATCH returns 404 and error message", () => {
      return request
        .patch(`/api/comments/${topic._id}?vote=up`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('That comment doesnt exist');
        });
    });
    it("PATCH returns 400 and error message", () => {
      return request
        .patch(`/api/comments/word?vote=up`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal('Cast to ObjectId failed for value "word" at path "_id" for model "comments"');
        });
    });
    it("DELETE returns 200", () => {
      return request
        .delete(`/api/comments/${comment._id}`)
        .expect(200)
        .then(res => {
          expect(res.body.message).to.equal('comment removed');
        });
    });
    it("DELETE returns 404 and error message", () => {
      return request
        .delete(`/api/comments/${topic._id}`)
        .expect(404)
        .then(res => {
          expect(res.body.message).to.equal('That article doesnt exist');
        });
    });
  })
});
