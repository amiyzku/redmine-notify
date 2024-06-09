import { describe, it, expect } from 'vitest'
import Note from './note'
import NoteNumber from './noteNumber'
import ArgumentException from '../../../shared/errors/argumentException'

describe('Note', () => {
  describe('constructor', () => {
    it('creates an instance with valid arguments', () => {
      // Arrange
      const number = new NoteNumber(1)
      const content = 'This is a test note'

      // Act
      const note = new Note(number, content)

      // Assert
      expect(note.number).toBe(number)
      expect(note.content).toBe(content)
    })

    it('throws an error if content is not a string', () => {
      // Arrange
      const number = new NoteNumber(1)
      const invalidContent = 123

      // Act & Assert
      expect(() => new Note(number, invalidContent as unknown as string)).toThrow(ArgumentException)
    })
  })

  describe('equals', () => {
    it('returns true if both notes have the same number and content', () => {
      // Arrange
      const number = new NoteNumber(1)
      const content = 'This is a test note'
      const note1 = new Note(number, content)
      const note2 = new Note(number, content)

      // Act
      const result = note1.equals(note2)

      // Assert
      expect(result).toBe(true)
    })

    it('returns false if notes have different numbers', () => {
      // Arrange
      const number1 = new NoteNumber(1)
      const number2 = new NoteNumber(2)
      const content = 'This is a test note'
      const note1 = new Note(number1, content)
      const note2 = new Note(number2, content)

      // Act
      const result = note1.equals(note2)

      // Assert
      expect(result).toBe(false)
    })

    it('returns false if notes have different contents', () => {
      // Arrange
      const number = new NoteNumber(1)
      const content1 = 'This is a test note'
      const content2 = 'This is another test note'
      const note1 = new Note(number, content1)
      const note2 = new Note(number, content2)

      // Act
      const result = note1.equals(note2)

      // Assert
      expect(result).toBe(false)
    })
  })
})
