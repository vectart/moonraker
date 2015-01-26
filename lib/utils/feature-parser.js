var config = require('moonraker').config,
    Yadda  = require('yadda');

module.exports = {

  parseFeatures: function (dir) {
    if (config.tags) var tags = sortTags(config.tags);
    var features = [];

    new Yadda.FeatureFileSearch(dir).each(function (file) {
      var English = Yadda.localisation.English;
      var parser = new Yadda.parsers.FeatureFileParser(English);
      var feature = parser.parse(file);

      if (!config.tags) {
        features.push(feature);
      } else if (shouldIncludeFeature(feature.annotations, tags)) {
        features.push(feature);
      }

    });
    return features;
  }

};

function sortTags(tagOpts) {
  var tags = { include: [], ignore: [] };
  tagOpts.split(',').forEach(function (tag) {
    if (tag.indexOf('!@') > -1) {
      tags.ignore.push(stripTag(tag));
    } else {
      tags.include.push(stripTag(tag));
    }
  });
  return tags;
}

function stripTag(tag) {
  return tag.replace('!', '').replace('@', '');
}

function shouldIncludeFeature(annotations, tags) {
  if (annotations.pending) return true;
  if (isTagged(tags.ignore, annotations)) return false;
  if (isTagged(tags.include, annotations)) return true;
  if (tags.include.length < 1) return true;
}

function isTagged(tagsArr, annotations) {
  var match = false;
  Object.keys(annotations).forEach(function (key) {
    if (tagsArr.indexOf(key) > -1) match = true;
  });
  return match;
}
