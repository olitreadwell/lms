import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the heavy Plyr dependency: the guard only cares that the constructor
// runs once per element, not what the player does. The settings store is mocked
// too (the seek listener reads it); neither is exercised in this test.
const plyrCtor = vi.hoisted(() =>
	vi.fn(function FakePlyr(this: { on: () => void }) {
		this.on = () => {}
	})
)
vi.mock('plyr', () => ({ default: plyrCtor }))
vi.mock('plyr/dist/plyr.css', () => ({}))
vi.mock('@/stores/settings', () => ({
	useSettings: () => ({ settings: { data: {} } }),
}))

import { enablePlyr } from '@/utils/plyr'

describe('enablePlyr double-init guard', () => {
	beforeEach(() => {
		plyrCtor.mockClear()
		document.body.innerHTML = ''
	})

	it('initialises Plyr once per .video-player even when enablePlyr runs repeatedly', async () => {
		const el = document.createElement('div')
		el.className = 'video-player'
		el.setAttribute('src', 'dQw4w9WgXcQ')
		document.body.appendChild(el)

		const first = await enablePlyr()
		const second = await enablePlyr()

		// The second pass must reuse the instance, not stack a second player
		// (which is what produced the duplicate controls).
		expect(plyrCtor).toHaveBeenCalledTimes(1)
		expect(first).toHaveLength(1)
		expect(second).toHaveLength(1)
		expect(second[0]).toBe(first[0])
	})

	it('initialises each distinct .video-player exactly once', async () => {
		for (const id of ['aaa', 'bbb']) {
			const el = document.createElement('div')
			el.className = 'video-player'
			el.setAttribute('src', id)
			document.body.appendChild(el)
		}

		await enablePlyr()
		await enablePlyr()

		expect(plyrCtor).toHaveBeenCalledTimes(2)
	})

	it('reads the player control labels from the site translations', async () => {
		const el = document.createElement('div')
		el.className = 'video-player'
		el.setAttribute('src', 'dQw4w9WgXcQ')
		document.body.appendChild(el)

		// A marker translator proves each label is looked up in the catalog
		// rather than left at Plyr's own English default.
		const globals = globalThis as unknown as {
			__: (message: string) => string
		}
		const previous = globals.__
		globals.__ = (message) => `translated:${message}`
		try {
			await enablePlyr()
		} finally {
			globals.__ = previous
		}

		const options = plyrCtor.mock.calls[0][1] as {
			i18n: Record<string, string>
		}
		expect(options.i18n.settings).toBe('translated:Settings')
		expect(options.i18n.speed).toBe('translated:Speed')
		expect(options.i18n.normal).toBe('translated:Normal')
		expect(options.i18n.play).toBe('translated:Play')
		expect(options.i18n.mute).toBe('translated:Mute')
		expect(options.i18n.menuBack).toBe('translated:Go back to previous menu')
		expect(options.i18n.enterFullscreen).toBe('translated:Enter fullscreen')
	})
})
