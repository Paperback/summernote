define(['summernote/core/async', 'summernote/core/document'], function (sync, documents) {
  /**
   * Async functions which returns `Promise`
   */
  var async = (function () {
    /**
     * read contents of file as representing URL
     *
     * @param {File} file
     * @return {Promise} - then: sDataUrl
     */
    var readFileAsDataURL = function (file) {
      return $.Deferred(function (deferred) {
        $.extend(new FileReader(), {
          onload: function (e) {
            var sDataURL = e.target.result;
            deferred.resolve(sDataURL);
          },
          onerror: function () {
            deferred.reject(this);
          }
        }).readAsDataURL(file);
      }).promise();
    };
  
    /**
     * create `<image>` from url string
     *
     * @param {String} sUrl
     * @return {Promise} - then: $image
     */
    var createImage = function (sUrl) {
      return $.Deferred(function (deferred) {
        $('<img>').one('load', function () {
          deferred.resolve($(this));
        }).one('error abort', function () {
          deferred.reject($(this));
        }).css({
          display: 'none'
        }).appendTo(documents.usingDocument.body).attr('src', sUrl);
      }).promise();
    };

    return {
      readFileAsDataURL: readFileAsDataURL,
      createImage: createImage
    };
  })();

  return async;
});
