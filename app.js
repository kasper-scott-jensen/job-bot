import express from 'express'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import fs from 'fs'

const app = express()

app.use(express.json())
dotenv.config()

const server = app.listen(process.env.SERVER, () => {
    console.log('server running on port', server.address().port)
})

const recipients = JSON.parse(fs.readFileSync('./data/recipients.json'))

const applicationPathDanish = './docs/application_da.pdf'
const applicationPathEnglish = './docs/application_en.pdf'
const resumePathDanish = './docs/resume_da.pdf'
const resumePathEnglish = './docs/resume_en.pdf'

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
})

recipients.forEach(recipient => {
    const options = {
        from: process.env.USER,
        to: recipient.email,
        subject: 'Uopfordret Ansøgning / Unsolicited Application',
        text: '',
        attachments: [
            {
                filename: 'application_da.pdf',
                path: applicationPathDanish
            },
            {
                filename: 'application_en.pdf',
                path: applicationPathEnglish
            },
            {
                filename: 'resume_da.pdf',
                path: resumePathDanish
            },
            {
                filename: 'resume_en.pdf',
                path: resumePathEnglish
            }
        ]
    }
    transporter.sendMail(options, (error, info) => {
        if (error) {
            console.error(`Error processing ${recipient}: `, error)
        } else {
            console.log(`Email successfully sent to ${recipient}: `, info.response)
        }
    })
})
