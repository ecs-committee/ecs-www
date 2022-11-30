import { prisma } from '../db/client'
import { EventEmitter } from 'events'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

const defaults: { [key: string]: string } = {
	show_form: 'true',
}

class SettingsProvider extends EventEmitter {
	public settings: { [key: string]: string } = {}

	constructor() {
		super()
		console.log('Settings: New instance')

		this.getSettings()

		setTimeout(() => {
			this.loadDefaults().catch((e) => {
				console.error('Error loading initial data to database', e)
			})
		}, 5000)
	}

	async loadDefaults() {
		// Load defaults
		for (let key of Object.keys(defaults)) {
			if (!this.settings[key] && defaults[key]) {
				await this.set(key, defaults[key] || '')
			}
		}

		if (this.settings.integration_api_secret === undefined) {
			await this.set('integration_api_secret', uuidv4())
		}
	}

	async getSettings() {
		this.settings = (await prisma.settings.findMany()).reduce<{ [key: string]: string }>((acc, cur) => {
			acc[cur.name] = cur.value
			return acc
		}, {})

		Object.keys(this.settings).forEach((key) => {
			this.emit(key, this.settings[key])
		})
	}

	get(name: string) {
		return this.settings[name]
	}

	async set(name: string, value: string) {
		// Default are loaded if you clear out screen_stylesheet
		if (name === 'screen_stylesheet' && value === '') {
			value = defaults.screen_stylesheet || ''
		}

		this.settings[name] = value

		await prisma.settings.upsert({
			where: {
				name,
			},
			update: {
				value: value,
			},
			create: {
				name: name,
				value: value,
			},
		})
		this.emit(name, value)
		this.emit('*', name, value)

		return value
	}
}

const Settings = new SettingsProvider()
export default Settings
