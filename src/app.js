const path = require('path')
const express = require('express')
const hbs = require('hbs')

const app = express()

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

// Define paths for Express config
const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicPath))

// Pass copywright year to templates as global variable
app.locals.copywriteYear = (new Date()).getFullYear();
app.locals.name = 'Alex Rusin'

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helpText: 'If you need help please contact me at alex@alex.com'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide address'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({
                error
            })
        }

        forecast(latitude, longitude, (error, forecast) => {
            if (error) {
                return res.send({
                    error
                })
            }

            return res.send({
                address: req.query.address,
                location,
                forecast
            })

        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Help artilce not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        errorMessage: 'Page not found'
    })
})

app.listen(3031, () => {
    console.log('Server is up on port 3031')
})