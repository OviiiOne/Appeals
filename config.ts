export default {
    bot_status: {
        type: "WATCHING", // WATCHING, PLAYING, LISTENING, STREAMING
        message: "apelaciones del servidor" // Mensaje del estado del bot
    },
    img: {
        main_icon: "https://i.imgur.com/MgktaZW.gif", // Icono principal del sistema
        banner: "https://i.imgur.com/3pH40wd.png", // Banner del la pagina principal
    },
    links: {
        website: "https://www.youtube.com/user/vegetta777", // Link del sitio web (el que sea)
    },
    emojis: {
        ban: "745595906317090856", //Emoji del botón de banear (Solo la ID)
        unban: "745595906140930070", //Emoji del botón de desbanear (Solo la ID)

        //Emojis de las votaciones
        grey_left: "<:grey_left:948208305929592862>", //Emoji gris de la izquierda
        grey_right: "<:grey_right:948208305883463710>", //Emoji gris de la derecha
        grey_center: "<:grey_center:948208305866670120>", //Emoji gris del centro

        green_left: "<:green_left:948208306130927626>", //Emoji verde de la izquierda
        green_right: "<:green_right:948208305958969454>", //Emoji verde de la derecha
        green_center: "<:green_center:948208305661157407>", //Emoji verde del centro

        red_left: "<:red_left:948208305900249138>", //Emoji rojo de la izquierda
        red_right: "<:red_right:948208305862508550>", //Emoji rojo de la derecha
        red_center: "<:red_center:948208305963163688>", //Emoji rojo del centro
    },
    wait_days: 30, // Días que el usuario debe de esperar para poder apelar
    server_name: "VEGETTA777", // Nombre del servidor
    argument_vote: true, // Pedir al usuario que ha votado la razón de su voto
}