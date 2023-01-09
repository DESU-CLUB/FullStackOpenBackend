const app = require("./app")
const server = require("http").createServer(app)
const config = require('./utils/config')
const logger = require('./utils/logger')

server.listen(config.PORT, ()=>{
    logger.info(`Running on PORT ${config.PORT}`)
})