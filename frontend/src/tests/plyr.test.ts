import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the heavy Plyr dependency: the guard only cares that the constructor
// runs once per element, not what the player does. The settings store is mocked
// too (the seek listener reads it); neither is exercised in this test.
const plyrCtor = vi.hoisted(() =>
	vi.fn(function FakePlyr(
		this: { on: () => void; elements: { container: HTMLElement } },
		video: HTMLElement
	) {
		this.on = () => {}
		const container = document.createElement('div')
		container.innerHTML =
			'<div class="plyr__controls"><button type="button">Play</button></div>'
		video.replaceWith(container)
		container.append(video)
		this.elements = { container }
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

// Guards: clicking the video left focus on <body>, so Space scrolled the page
// instead of pausing (#1461), and no captions control (#1461). Test added with
// the a11y audit remediation.
describe('enablePlyr keyboard and captions', () => {
	beforeEach(() => {
		plyrCtor.mockClear()
		document.body.innerHTML = ''
	})

	const setup = async () => {
		const el = document.createElement('div')
		el.className = 'video-player'
		el.setAttribute('src', 'dQw4w9WgXcQ')
		document.body.appendChild(el)
		const [player] = await enablePlyr()
		return player.elements.container as HTMLElement
	}

	it.each(['.video-player', 'button'])(
		'moves focus into the player when a click on %s leaves it outside',
		async (selector) => {
			const container = await setup()
			container.querySelector<HTMLElement>(selector)!.click()
			expect(document.activeElement).toBe(container)
		}
	)

	it('leaves focus on a control that was clicked', async () => {
		const button = (await setup()).querySelector('button')!
		button.focus()
		button.click()
		expect(document.activeElement).toBe(button)
	})

	it('offers the captions control', async () => {
		await setup()
		const options = expect.objectContaining({
			controls: expect.arrayContaining(['captions']),
		})
		expect(plyrCtor).toHaveBeenCalledWith(expect.anything(), options)
	})
})
