from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:@localhost/prfut_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'

db = SQLAlchemy(app)

class Aposta(db.Model):
    __tablename__ = 'apostas'
    id = db.Column(db.Integer, primary_key=True)
    data_aposta = db.Column(db.Date, nullable=False)
    hora_aposta = db.Column(db.Time, nullable=False)
    pais = db.Column(db.String(100), nullable=False)
    liga = db.Column(db.String(100), nullable=False)
    time_casa = db.Column(db.String(100), nullable=False)
    time_visitante = db.Column(db.String(100), nullable=False)
    mercado = db.Column(db.String(100), nullable=False)
    metodo = db.Column(db.String(100), nullable=False)
    stake = db.Column(db.Float, nullable=False)
    casa_aposta = db.Column(db.String(100), nullable=False)
    odd_entrada = db.Column(db.Float, nullable=False)
    tipo_entrada = db.Column(db.String(20), nullable=False)
    tipo_operacao = db.Column(db.String(20), nullable=False)
    tipo_saida = db.Column(db.String(20), nullable=False)
    pl = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/apostas', methods=['POST'])
def criar_aposta():
    data = request.json
    nova_aposta = Aposta(
        data_aposta=datetime.strptime(data['data_aposta'], '%Y-%m-%d').date(),
        hora_aposta=datetime.strptime(data['hora_aposta'], '%H:%M').time(),
        pais=data['pais'],
        liga=data['liga'],
        time_casa=data['time_casa'],
        time_visitante=data['time_visitante'],
        mercado=data['mercado'],
        metodo=data['metodo'],
        stake=float(data['stake']),
        casa_aposta=data['casa_aposta'],
        odd_entrada=float(data['odd_entrada']),
        tipo_entrada=data['tipo_entrada'],
        tipo_operacao=data['tipo_operacao'],
        tipo_saida=data['tipo_saida'],
        pl=float(data['pl'])
    )
    db.session.add(nova_aposta)
    db.session.commit()
    return jsonify({'message': 'Aposta criada com sucesso!'}), 201

@app.route('/api/mercados')
def get_mercados():
    mercados = db.session.query(Aposta.mercado).distinct().all()
    return jsonify([m[0] for m in mercados])

@app.route('/api/metodos')
def get_metodos():
    metodos = db.session.query(Aposta.metodo).distinct().all()
    return jsonify([m[0] for m in metodos])

@app.route('/api/jogos')
def get_jogos():
    try:
        jogos = Aposta.query.order_by(Aposta.data_aposta.desc(), Aposta.hora_aposta.desc()).all()
        return jsonify([{
            'id': jogo.id,
            'data_aposta': jogo.data_aposta.strftime('%d/%m/%Y'),
            'hora_aposta': jogo.hora_aposta.strftime('%H:%M'),
            'pais': jogo.pais,
            'liga': jogo.liga,
            'time_casa': jogo.time_casa,
            'time_visitante': jogo.time_visitante,
            'mercado': jogo.mercado,
            'metodo': jogo.metodo,
            'pl': jogo.pl
        } for jogo in jogos])
    except Exception as e:
        print('Error loading jogos:', str(e))
        return jsonify({'error': str(e)}), 500

@app.route('/api/jogos/<int:id>')
def get_jogo(id):
    jogo = Aposta.query.get_or_404(id)
    return jsonify({
        'id': jogo.id,
        'data_aposta': jogo.data_aposta.strftime('%Y-%m-%d'),
        'hora_aposta': jogo.hora_aposta.strftime('%H:%M'),
        'pais': jogo.pais,
        'liga': jogo.liga,
        'time_casa': jogo.time_casa,
        'time_visitante': jogo.time_visitante,
        'mercado': jogo.mercado,
        'metodo': jogo.metodo,
        'stake': float(jogo.stake),
        'casa_aposta': jogo.casa_aposta,
        'odd_entrada': float(jogo.odd_entrada),
        'tipo_entrada': jogo.tipo_entrada,
        'tipo_operacao': jogo.tipo_operacao,
        'tipo_saida': jogo.tipo_saida,
        'pl': float(jogo.pl)
    })

@app.route('/api/jogos/<int:id>', methods=['PUT'])
def update_jogo(id):
    jogo = Aposta.query.get_or_404(id)
    data = request.json
    
    jogo.data_aposta = datetime.strptime(data['data_aposta'], '%Y-%m-%d').date()
    jogo.hora_aposta = datetime.strptime(data['hora_aposta'], '%H:%M').time()
    jogo.pais = data['pais']
    jogo.liga = data['liga']
    jogo.time_casa = data['time_casa']
    jogo.time_visitante = data['time_visitante']
    jogo.mercado = data['mercado']
    jogo.metodo = data['metodo']
    jogo.stake = float(data['stake'])
    jogo.casa_aposta = data['casa_aposta']
    jogo.odd_entrada = float(data['odd_entrada'])
    jogo.tipo_entrada = data['tipo_entrada']
    jogo.tipo_operacao = data['tipo_operacao']
    jogo.tipo_saida = data['tipo_saida']
    jogo.pl = float(data['pl'])
    
    db.session.commit()
    return jsonify({'message': 'Jogo atualizado com sucesso!'})

@app.route('/api/dashboard')
def get_dashboard_data():
    try:
        # Aplicar filtros
        query = Aposta.query

        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        mercado = request.args.get('mercado')
        metodo = request.args.get('metodo')

        if start_date:
            query = query.filter(Aposta.data_aposta >= datetime.strptime(start_date, '%Y-%m-%d').date())
        if end_date:
            query = query.filter(Aposta.data_aposta <= datetime.strptime(end_date, '%Y-%m-%d').date())
        if mercado:
            query = query.filter(Aposta.mercado == mercado)
        if metodo:
            query = query.filter(Aposta.metodo == metodo)

        apostas = query.order_by(Aposta.data_aposta, Aposta.hora_aposta).all()
        
        if not apostas:
            return jsonify({
                'metricas': {
                    'pl_total': 0,
                    'winrate': 0,
                    'roi': 0,
                    'stake_media': 0,
                    'total_apostas': 0,
                    'greens': 0,
                    'reds': 0,
                    'pl_variacao': 0,
                    'winrate_variacao': 0,
                    'roi_variacao': 0,
                    'stake_variacao': 0
                },
                'pl_acumulado': [],
                'pl_por_liga': [],
                'pl_por_mercado': [],
                'pl_por_metodo': []
            })

        # Calcular métricas básicas
        pl_total = sum(aposta.pl for aposta in apostas)
        stake_total = sum(aposta.stake for aposta in apostas)
        stake_media = stake_total / len(apostas) if apostas else 0
        greens = len([a for a in apostas if a.pl > 0])
        reds = len([a for a in apostas if a.pl <= 0])
        total_apostas = len(apostas)
        
        # Calcular métricas percentuais
        winrate = (greens / total_apostas * 100) if total_apostas > 0 else 0
        roi = (pl_total / stake_total * 100) if stake_total > 0 else 0
        
        # Calcular métricas do dia anterior
        hoje = datetime.now().date()
        ontem = hoje - timedelta(days=1)
        
        apostas_ontem = query.filter(Aposta.data_aposta == ontem).all()
        
        pl_ontem = sum(aposta.pl for aposta in apostas_ontem) if apostas_ontem else 0
        stake_ontem = sum(aposta.stake for aposta in apostas_ontem) if apostas_ontem else 0
        stake_media_ontem = stake_ontem / len(apostas_ontem) if apostas_ontem else 0
        greens_ontem = len([a for a in apostas_ontem if a.pl > 0])
        total_apostas_ontem = len(apostas_ontem)
        
        # Calcular métricas do dia anterior
        winrate_ontem = (greens_ontem / total_apostas_ontem * 100) if total_apostas_ontem > 0 else 0
        roi_ontem = (pl_ontem / stake_ontem * 100) if stake_ontem > 0 else 0
        
        # Calcular variações percentuais
        pl_variacao = ((pl_total - pl_ontem) / abs(pl_ontem) * 100) if pl_ontem != 0 else 0
        winrate_variacao = winrate - winrate_ontem
        roi_variacao = roi - roi_ontem
        stake_variacao = ((stake_media - stake_media_ontem) / stake_media_ontem * 100) if stake_media_ontem != 0 else 0
        
        # PL por liga
        pl_por_liga = {}
        for aposta in apostas:
            if aposta.liga not in pl_por_liga:
                pl_por_liga[aposta.liga] = 0
            pl_por_liga[aposta.liga] += aposta.pl
        
        # Ordenar ligas por PL e pegar top 10
        pl_por_liga = dict(sorted(pl_por_liga.items(), key=lambda x: abs(x[1]), reverse=True)[:10])
        
        # PL por mercado
        pl_por_mercado = {}
        for aposta in apostas:
            if aposta.mercado not in pl_por_mercado:
                pl_por_mercado[aposta.mercado] = 0
            pl_por_mercado[aposta.mercado] += aposta.pl
        
        # Ordenar mercados por PL e pegar top 10
        pl_por_mercado = dict(sorted(pl_por_mercado.items(), key=lambda x: abs(x[1]), reverse=True)[:10])
        
        # PL por método
        pl_por_metodo = {}
        for aposta in apostas:
            if aposta.metodo not in pl_por_metodo:
                pl_por_metodo[aposta.metodo] = 0
            pl_por_metodo[aposta.metodo] += aposta.pl
        
        # Ordenar métodos por PL e pegar top 10
        pl_por_metodo = dict(sorted(pl_por_metodo.items(), key=lambda x: abs(x[1]), reverse=True)[:10])
        
        # Preparar dados do gráfico de PL acumulado
        pl_acumulado = []
        pl_atual = 0
        datas_unicas = sorted(set(aposta.data_aposta for aposta in apostas))
        
        for data in datas_unicas:
            apostas_do_dia = [a for a in apostas if a.data_aposta == data]
            pl_do_dia = sum(a.pl for a in apostas_do_dia)
            pl_atual += pl_do_dia
            pl_acumulado.append({
                'data': data.strftime('%Y-%m-%d'),
                'pl': round(pl_atual, 2)
            })

        return jsonify({
            'metricas': {
                'pl_total': pl_total,
                'winrate': winrate,
                'roi': roi,
                'stake_media': stake_media,
                'total_apostas': total_apostas,
                'greens': greens,
                'reds': reds,
                'pl_ontem': pl_ontem,
                'winrate_ontem': winrate_ontem,
                'roi_ontem': roi_ontem,
                'stake_media_ontem': stake_media_ontem,
                'pl_variacao': pl_variacao,
                'winrate_variacao': winrate_variacao,
                'roi_variacao': roi_variacao,
                'stake_variacao': stake_variacao
            },
            'pl_acumulado': pl_acumulado,
            'pl_por_liga': [{'liga': liga, 'pl': pl} for liga, pl in pl_por_liga.items()],
            'pl_por_mercado': [{'mercado': mercado, 'pl': pl} for mercado, pl in pl_por_mercado.items()],
            'pl_por_metodo': [{'metodo': metodo, 'pl': pl} for metodo, pl in pl_por_metodo.items()]
        })
    except Exception as e:
        print('Error in dashboard:', str(e))
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
