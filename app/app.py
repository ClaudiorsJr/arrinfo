from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/relatorios')
def dashboards():
    return render_template('dashboards.html')

@app.route('/sobre')
def about():
    return render_template('about.html')
@app.route('/sobre_v2')
def about_v2():
    return render_template('about_v2.html')

@app.route('/estrategico')
def estrategico():
    return render_template('estrategico.html')

@app.route('/gerencial')
def gerencial():
    return render_template('gerencial.html')


# Adicione esta rota para evitar flicker ao voltar no navegador
@app.after_request
def add_header(response):
    if 'Cache-Control' not in response.headers:
        response.headers['Cache-Control'] = 'no-store'
    return response

if __name__ == '__main__':
    app.run(debug=True)