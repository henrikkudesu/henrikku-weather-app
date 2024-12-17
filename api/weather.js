const axios = require('axios');

module.exports = async (req, res) => {
    // Lê o nome da cidade a partir da query string
    const city = req.query.city;

    // Lê a chave da API a partir das variáveis de ambiente
    const apiKey = process.env.API_KEY;

    // Validações básicas
    if (!city) {
        return res.status(400).json({ error: 'O nome da cidade é obrigatório.' });
    }

    try {
        // Faz a requisição à API do OpenWeatherMap
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`
        );

        // Retorna os dados climáticos ao frontend
        res.status(200).json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar os dados climáticos.' });
    }
};
