import { describe, it, expect } from 'vitest'
import Tracker from './tracker'
import ArgumentException from '../../../shared/errors/argumentException'

describe('Tracker', () => {
  describe('constructor', () => {
    it('creates an instance with a valid string', () => {
      const validValue = 'Bug'
      const tracker = new Tracker(validValue)
      expect(tracker.value).toBe(validValue)
    })

    it('throws an error if the string is empty', () => {
      const emptyValue = ''
      expect(() => new Tracker(emptyValue)).toThrow(ArgumentException)
    })
  })

  describe('equals', () => {
    it('returns true if both Tracker instances have the same value', () => {
      const value = 'Bug'
      const tracker1 = new Tracker(value)
      const tracker2 = new Tracker(value)
      const result = tracker1.equals(tracker2)
      expect(result).toBe(true)
    })

    it('returns false if Tracker instances have different values', () => {
      const tracker1 = new Tracker('Bug')
      const tracker2 = new Tracker('Feature')
      const result = tracker1.equals(tracker2)
      expect(result).toBe(false)
    })
  })
})
