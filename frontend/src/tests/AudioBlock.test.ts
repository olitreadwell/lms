import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

// Bug #2717: AudioBlock mounted while its block was still detached from the
// document (EditorJS builds a block's wrapper, mounts the Vue component, and
// only then appends it to the page). onMounted looked the element up globally:
//
//   audio.value = document.querySelector('audio')
//   audio.value.onloadedmetadata = ...
//
// While detached, querySelector returns null and the old code threw on the
// next line -> "Cannot set properties of null (setting 'onloadedmetadata')",
// so audio blocks never rendered. A lesson with more than one audio block hit
// a second bug: querySelector returns the *first* <audio> in the whole
// document, so every block bound to the same first element.
//
// The fix scopes each block to its own <audio> (template ref) and guards null,
// so a detached mount must mount cleanly and read its own metadata.
import AudioBlock from '@/components/AudioBlock.vue'

const global = { mocks: { __: (s: string) => s } }

async function flush() {
	// Old onMounted deferred its work with setTimeout(..., 0); give it room.
	await new Promise((r) => setTimeout(r, 30))
}

describe('AudioBlock', () => {
	it('mounts without crashing while the block is detached from the document', async () => {
		// No attachTo: the wrapper stays in a detached root. A global query
		// finds no <audio>, which used to throw inside onMounted. Capture any
		// async throw on window so the regression is caught, not swallowed.
		let errored: unknown = null
		const onError = (e: ErrorEvent) => {
			errored = e.error ?? e.message
		}
		window.addEventListener('error', onError)

		const wrapper = mount(AudioBlock, {
			props: { file: '/files/audio.mp3' },
			global,
		})
		await flush()

		window.removeEventListener('error', onError)
		wrapper.unmount()

		expect(errored).toBeNull()
	})

	it('does not bind to the first <audio> in the document', async () => {
		// A foreign <audio> already on the page (e.g. an earlier lesson block).
		// The old global query bound this block to that first element instead of
		// its own. The fix binds the block's own element, leaving `foreign` with
		// no media handlers.
		const foreign = document.createElement('audio')
		document.body.appendChild(foreign)

		const wrapper = mount(AudioBlock, {
			props: { file: '/files/audio.mp3' },
			attachTo: document.body,
			global,
		})
		await flush()

		expect(foreign.onloadedmetadata).toBeNull()
		expect(foreign.ontimeupdate).toBeNull()

		wrapper.unmount()
	})
})
