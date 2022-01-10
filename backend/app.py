from flask import Flask, send_file, request, flash
from flask_restx import Resource, Api
from werkzeug.utils import secure_filename
import config as config
from src.colorizer import predict

app = Flask(__name__)
api = Api(app)


@api.route('/')
class HelloWorld(Resource):
    def get(self):
        return {'hello': 'world'}


@api.route('/api/test')
class Image(Resource):
    def get(self):
        import time
        time.sleep(5)
        filename = 'resources/test.jpg'
        return send_file(filename, mimetype='image/jpg')

    def post(self):
        if 'file' not in request.files:
            flash('No file part')
        file = request.files['file']
        filename = secure_filename(file.filename)
        file.save(filename)
        return send_file(filename, mimetype=file.mimetype)


@api.route('/api/v1/predict/<int:mode>', methods=['POST'])
class ColorizedImage(Resource):
    def post(self, mode):
        try:
            # args = colorize_param.parse_args()
            files = request.files
            data = request.form

            source_image = files.get('source_image')
            source_image.save(f'{config.SOURCE_IMAGES_PATH}/{source_image.filename}')

            if mode == 1:
                predict(mode=1, filename=source_image.filename, threshold=float(data.get('threshold', '0')))
                return send_file(f'{config.RESULT_IMAGES_PATH}/{source_image.filename}', mimetype=source_image.mimetype)
            elif mode == 2:
                supplement_image = files.get('supplement_image')
                supplement_image.save(f'{config.SUPPLEMENT_IMAGES_PATH}/{supplement_image.filename}')
                predict(mode=2, filename=source_image.filename, src_img=supplement_image.filename,
                        threshold=float(data.get('threshold', '0')))
                return send_file(f'{config.RESULT_IMAGES_PATH}/{source_image.filename}', mimetype=source_image.mimetype)
            elif mode == 3:
                color = data.get('color').split(',')
                for c in color:
                    c = int(c)
                color = [(color[0], color[1], color[2], color[3]),
                         (color[4], color[5], color[6], color[7]),
                         (color[8], color[9], color[10], color[11])]
                predict(mode=3, filename=source_image.filename, color=color, threshold=float(data.get('threshold', '0')))
                return send_file(f'{config.RESULT_IMAGES_PATH}/{source_image.filename}', mimetype=source_image.mimetype)
            else:
                return {
                    'msg': "Sai mode tô màu ảnh."
                }
        except:
            return {
                'msg': "Server bị lỗi."
            }


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
