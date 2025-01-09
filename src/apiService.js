// src/apiService.js
import axios from 'axios';
import moment from 'moment';
import verificarData from './util';

// URL base da API do Banco Central
const BASE_URL = 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata';

/**
 * Função para buscar as moedas disponíveis.
 * @returns {Promise<Array>} Lista de moedas
 */
export const fetchMoedas = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL}/Moedas?$top=100&$orderby=simbolo&$format=json&$select=simbolo,nomeFormatado,tipoMoeda`
    );
    return response.data.value;
  } catch (error) {
    console.error('Erro ao buscar as moedas:', error);
    throw error;
  }
};

/**
 * Função para buscar a cotação de uma moeda específica na data atual.
 * @param {string} moeda - Símbolo da moeda (ex: "USD")
 * @returns {Promise<number>} Cotação da moeda
 */
export const fetchCotacao = async (moeda) => {
  const dataAtual = moment(verificarData()).format('MM-DD-YYYY');
  try {
    const response = await axios.get(
      `${BASE_URL}/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='${moeda}'&@dataCotacao='${dataAtual}'&$top=100&$format=json`
    );

    if (response.data.value && response.data.value.length > 0) {
      return response.data.value[0].cotacaoVenda;
    } else {
      return 0; // Caso não haja cotação disponível
    }
  } catch (error) {
    console.error('Erro ao buscar a cotação:', error);
    throw error;
  }
};
