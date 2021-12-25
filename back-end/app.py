from flask import Flask, send_file, request, flash
from werkzeug.utils import secure_filename

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/api/test')
def get_image():
    filename = './test.jpg'
    return send_file(filename, mimetype='image/jpg')

@app.route('/api/test2', methods=['POST'])
def send_n_receive_image():
    if 'file' not in request.files:
        flash('No file part')
    file = request.files['file']
    filename = secure_filename(file.filename)
    file.save(filename)
    return send_file(filename, mimetype=file.mimetype)

if __name__ == '__main__':
    app.run()
