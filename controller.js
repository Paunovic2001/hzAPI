const cheerio = require('cheerio');
const axios = require('axios');

const hzUri = 'http://vred.hzinfra.hr/hzinfo/default.asp?VL={id}&Category=hzinfo&Service=Tpvl&SCREEN=2'
var reg = /^\d+$/;

exports.getTrain = async (req, res, body) => {
    const data = await getTrain(req.params.id);

    res.status(200).json(data);
}

exports.howLateIsTrain = async (req, res, body) => {
    const data = await getTrainTime(req.params.id);

    res.status(200).json(data);
}

async function getTrainTime(id){
    const url = hzUri.replace('{id}', id)
    
    if(!reg.test(id)) {
        return {
            success: false,
            error: 'Please enter a valid train ID'
        }
    }

    try {
        const response = await axios.get(url);
        const $= cheerio.load(response.data);
        const late = $('blink').text().trimEnd().replace(/\s\s+/g, ' ');

        if(late.length === 0){
            return {
                success: false,
                error: 'Train with id \'' + id + '\' does not exist'
            }
        }

        return {
            success: true,
            data: {train: id, timeLate: late}}
    }
    catch(error){
        console.log(error);
    }
}

async function getTrain(id){
    const url = hzUri.replace('{id}', id)

    if(!reg.test(id)) {
        return {
            success: false,
            error: 'Please enter a valid train ID'
        }
    }

    try {
        const response = await axios.get(url);
        const $= cheerio.load(response.data);
        
        const late = $('blink').text().trimEnd().replace(/\s\s+/g, ' ');
        let trainRoute = $('body > form > p > font > table > tbody > tr:nth-child(1) > td').text().trimEnd();
        trainRoute = trainRoute.substring(trainRoute.lastIndexOf(' ') + 1)
        const station = $('body > form > p > font > table > tbody > tr:nth-child(2) > td > strong').text().trimEnd().replaceAll('+', ' ');
        
        if(late.length === 0){
            return {
                success: false,
                error: 'Train with id \'' + id + '\' does not exist'
            }
        }

        return {
            success: true,
            data:{train: id, timeLate: late, route: trainRoute, station: station}}
    }
    catch(error){
        console.log(error);
    }
}