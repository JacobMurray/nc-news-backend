exports.createRefObj = (data, docs) => {
  return data.reduce((acc, dataValue, index) => {
    acc[dataValue.username] = docs[index]._id;
    return acc;
  }, {});
};

exports.createArticleRefObj = (data, docs) => {
  return data.reduce((acc, dataValue, index) => {
    acc[dataValue.title] = docs[index]._id;
    return acc;
  }, {});
};
exports.formatArticleData = (articleData, userRefObj, topicData) => {
  return articleData.map(articleDatum => {
    const created_by = userRefObj[articleDatum.created_by];
    const belongs_to = topicData.find(
      element => element.slug === articleDatum.topic
    ).slug;
    return { ...articleDatum, created_by, belongs_to };
  });
};

exports.formatCommentData = (commentData, userRefObj, articleRefObj) => {
  return commentData.map(commentDatum => {
    const created_by = userRefObj[commentDatum.created_by];
    const belongs_to = articleRefObj[commentDatum.belongs_to];
    return { ...commentDatum, created_by, belongs_to };
  });
};
