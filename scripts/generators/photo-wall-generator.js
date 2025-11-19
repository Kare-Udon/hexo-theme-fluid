const fs = require('fs');
const path = require('path');

module.exports =  function (locals) {
  const config = this.config;

  const photoDir = path.join(config.source_dir, 'images/photo_wall');
  const ymMap = new Map();
  var photoData = {
    yms: [],
    data: [],
    collections: []
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
            }

            const ymKey = `${year}-${month}`;
            if (!ymMap.has(ymKey)) {
              ymMap.set(ymKey, []);
            }
            const info = { year, month, photo: photoPath };
            ymMap.get(ymKey).push(info);
            photoData.data.push(info);
          });
        }
      });
    }
  });

  const sortByDateDesc = (arr) => arr.sort((a, b) => {
    const dateA = new Date(Number(a.year), Number(a.month) - 1);
    const dateB = new Date(Number(b.year), Number(b.month) - 1);
    return dateB - dateA;
  });

  sortByDateDesc(photoData.yms);
  sortByDateDesc(photoData.data);

  photoData.collections = photoData.yms.map(({ year, month }) => {
    const ymKey = `${year}-${month}`;
    const photos = sortByDateDesc(ymMap.get(ymKey) || []);
    return { year, month, photos };
  });

  return {
    path: 'photo_wall/index.html',
    data: { photoData },
    layout: 'photo_wall'
  };
};
