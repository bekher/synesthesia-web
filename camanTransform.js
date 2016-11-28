var Caman = require('caman').Caman;

var transform = function(id, filters, cb) {
  let path = "outputs/images/"+id+".png";
  Caman(path, function() {
    for (var filter in filters) {
      if (filters.hasOwnProperty(filter)) {
        let val = filters[filter];
        if (val != 0) 
          this[filter](val);
      }
    }
    this.render(function () {
        this.save(path);
        cb();
    });

  });

}
module.exports = transform;
