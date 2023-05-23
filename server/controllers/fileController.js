const path = require('path');

exports.getFile = async (req, res) => {
  const filename = req.params.id;
  if (filename.split('.')[1] == 'pdf') {
    // Set the Content-Disposition header to indicate attachment
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    return res.sendFile(
      path.resolve(`./public/uploads/assignments/${filename}`)
    );
  } else if (filename.split('.')[1] == 'jpeg') {
    if (filename.startsWith('post')) {
      return res.sendFile(path.resolve(`./public/img/posts/${filename}`));
    } else if (filename.startsWith('user')) {
      return res.sendFile(path.resolve(`./public/img/users/${filename}`));
    } else {
      return res.status(404).send('File not found');
    }
  } else {
    return res.status(404).send('File not found');
  }
};
