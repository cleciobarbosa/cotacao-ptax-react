import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import moment from 'moment'
import verificarData from './util'
function App() {
  const [moedas, setMoedas] = useState([])
  const [cotacao, setCotacao] = useState(0)
  const [moeda, setMoeda] = useState('Selecione uma moeda')

  useEffect(() => {
    // Buscar as moedas
    axios.get('https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$orderby=simbolo&$format=json&$select=simbolo,nomeFormatado,tipoMoeda')
      .then(response => {
        setMoedas(response.data.value)
      }).catch(error => {
        console.error('Erro ao buscar as moedas:', error);
      });
  }, [])

  const handleSelectChange = (event) => {
    const moedaSelecionada = event.target.value;
    setMoeda(moedaSelecionada); // Atualiza o estado
    getCotacao(moedaSelecionada); // Passa diretamente a moeda selecionada
  }

  const getCotacao = (moeda) => {
    const dataAtual = moment(verificarData()).format('MM-DD-YYYY');
    console.log(dataAtual);
    
    axios.get(`https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='${moeda}'&@dataCotacao='${dataAtual}'&$top=100&$format=json`)
      .then((response) => {
        if (response.data.value && response.data.value.length > 0) {
          setCotacao(response.data.value[0].cotacaoVenda);
        } else {
          setCotacao(0); // Caso não haja cotação disponível
        }
      }).catch(error => {
        console.error('Erro ao buscar a cotação:', error);
        setCotacao(0); // Reseta a cotação se houver erro
      });
  }

  return (
    <>
      <div>
        <div >
          <label>Selecione uma moeda</label>
          <select onChange={handleSelectChange}>
            {moedas.map(moeda => (
              <option key={moeda.simbolo} value={moeda.simbolo}>{moeda.simbolo} - {moeda.nomeFormatado}</option>)
            )}
            <option value='Selecione uma moeda'>Selecione uma moeda</option>
          </select>
        </div>
        {cotacao > 0 ?
          <div id="divCotacao">
            <label >Cotação</label>
            <input type="text" value={"R$ " + cotacao} disabled />
          </div>
          : ''}
      </div>
    </>
  )
}

export default App
