const verificarData = () => {
    const hoje = new Date();
    const diaSemana = hoje.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
    const horaAtual = hoje.getHours(); // Pega a hora atual

    // Se for final de semana (sábado ou domingo), ajustar para sexta-feira
    if (diaSemana === 6) {
      // Sábado, subtrair 1 dia
      hoje.setDate(hoje.getDate() - 1);
    } else if (diaSemana === 0) {
      // Domingo, subtrair 2 dias
      hoje.setDate(hoje.getDate() - 2);
    } else if (diaSemana === 1 && horaAtual < 10) {
      // Segunda-feira antes das 10:00, subtrair 3 dias
      hoje.setDate(hoje.getDate() - 3);
    }

    return hoje; // Define a data formatada
  };

  export default  verificarData;