const fs = require('fs');
const path = require('path');

module.exports =  function (locals) {
  const config = this.config;
  
  const photoDir = path.join(config.source_dir, 'images/photo_wall');
  var photoData = {
    yms: [],
    data: []
  };

  fs.readdirSync(photoDir).forEach(year => {
    const yearDir = path.join(photoDir, year);
    if (fs.statSync(yearDir).isDirectory()) {
      fs.readdirSync(yearDir).forEach(month => {
        const monthDir = path.join(yearDir, month);
        if (fs.statSync(monthDir).isDirectory()) {
          fs.readdirSync(monthDir).forEach(photo => {
            const photoPath = path.join('/images/photo_wall', year, month, photo);
            if (!photoData.yms.find(ym => ym.year === year && ym.month === month)) {
              photoData.yms.push({year, month});
            };
            photoData.data.push({
              year,
              month,
              photo: photoPath
            });
          });
        }
      });
    }
  });

  photoData.yms.sort((a, b) => {
    const dateA = new Date(a.year, a.month - 1);
    const dateB = new Date(b.year, b.month - 1);
    return dateB - dateA;
  });

  photoData.data.sort((a, b) => {
    const dateA = new Date(a.year, a.month - 1);
    const dateB = new Date(b.year, b.month - 1);
    return dateB - dateA;
  });

  return {
    path: 'photo_wall/index.html',
    data: { photoData },
    layout: 'photo_wall'
  };
};