define(['summernote/core/iframe', 'summernote/core/dom'], function (iframe, dom) {
  var documents = (function () {

    var setDocument = function (editable) {
      this.usingDocument = get(editable);
    };

    /**
     * return document being used
     * @param {jQuery} $node
     * @return {Object} document
     */

    var using = function () {
      return this.usingDocument;
    };

    /**
     * get document of node
     * @param {jQuery} $node
     * @return {Object} document
     */

    var get = function ($node) {
      if (dom.isIframe($node[0])) {
        return iframe.doc($node);
      } else {
        return document;
      }
    };

    return {
      setDocument: setDocument,
      using: using,
      get: get
    };
  })();

  return documents;
});
