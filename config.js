module.exports = {

    'secret': 'superlamesecret',
    'useHttps': false, //if true dont forget to add certficates in folder certificate.
    'database': 'mongodb://localhost:27017/site-template',
    'registar': true, //enable new users regist
    'tokenDuration': 600000 //time variable for session duration (token and cookies)

};
