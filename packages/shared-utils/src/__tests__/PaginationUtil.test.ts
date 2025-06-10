import { describe, it, expect } from 'vitest';
import { PaginationUtil } from '../PaginationUtil';

describe('PaginationUtil', () => {
  describe('getPage', () => {
    it('should calculate page number correctly for valid skip and take values', () => {
      // Test cases: [skip, take, expectedPage]
      const testCases = [
        [0, 10, 1], // First page
        [10, 10, 2], // Second page
        [20, 10, 3], // Third page
        [0, 5, 1], // First page with different take
        [5, 5, 2], // Second page with different take
        [15, 5, 4], // Fourth page
        [0, 1, 1], // Single item per page
        [1, 1, 2], // Second item
        [99, 10, 10], // Higher page number
      ];

      testCases.forEach(([skip, take, expectedPage]) => {
        // Act
        const result = PaginationUtil.getPage({ skip, take });

        // Assert
        expect(result).toBe(expectedPage);
      });
    });

    it('should throw error when take is 0', () => {
      // Arrange
      const skip = 10;
      const take = 0;

      // Act & Assert
      expect(() => PaginationUtil.getPage({ skip, take })).toThrow(
        'Take must be greater than 0',
      );
    });

    it('should handle edge case when skip is 0', () => {
      // Arrange
      const skip = 0;
      const take = 20;

      // Act
      const result = PaginationUtil.getPage({ skip, take });

      // Assert
      expect(result).toBe(1);
    });

    it('should handle partial pages correctly', () => {
      // Arrange - when skip is not evenly divisible by take
      const skip = 7;
      const take = 5;

      // Act
      const result = PaginationUtil.getPage({ skip, take });

      // Assert
      expect(result).toBe(2); // Math.floor(7/5) + 1 = 1 + 1 = 2
    });
  });

  describe('toArgs', () => {
    it('should return empty object for empty query', () => {
      // Arrange
      const query = {};

      // Act
      const result = PaginationUtil.toArgs(query);

      // Assert
      expect(result).toEqual({});
    });

    it('should handle take and skip parameters', () => {
      // Arrange
      const query = { take: 10, skip: 20 };

      // Act
      const result = PaginationUtil.toArgs(query);

      // Assert
      expect(result).toEqual({
        take: 10,
        skip: 20,
        where: {},
        orderBy: {},
      });
    });

    it('should handle sort order parameters', () => {
      // Arrange
      const query = { nameSortOrder: 'asc', dateSortOrder: 'desc' };

      // Act
      const result = PaginationUtil.toArgs(query);

      // Assert
      expect(result).toEqual({
        where: {},
        orderBy: {
          name: 'asc',
          date: 'desc',
        },
      });
    });

    it('should handle where conditions', () => {
      // Arrange
      const query = { status: 'active', category: 'tech' };

      // Act
      const result = PaginationUtil.toArgs(query);

      // Assert
      expect(result).toEqual({
        where: {
          status: 'active',
          category: 'tech',
        },
        orderBy: {},
      });
    });

    it('should handle mixed parameters (take, skip, sortOrder, where)', () => {
      // Arrange
      const query = {
        take: 15,
        skip: 30,
        nameSortOrder: 'asc',
        status: 'published',
        authorId: '123',
        dateSortOrder: 'desc',
      };

      // Act
      const result = PaginationUtil.toArgs(query);

      // Assert
      expect(result).toEqual({
        take: 15,
        skip: 30,
        where: {
          status: 'published',
          authorId: '123',
        },
        orderBy: {
          name: 'asc',
          date: 'desc',
        },
      });
    });

    it('should handle only take parameter', () => {
      // Arrange
      const query = { take: 5 };

      // Act
      const result = PaginationUtil.toArgs(query);

      // Assert
      expect(result).toEqual({
        take: 5,
        where: {},
        orderBy: {},
      });
    });

    it('should handle only skip parameter', () => {
      // Arrange
      const query = { skip: 10 };

      // Act
      const result = PaginationUtil.toArgs(query);

      // Assert
      expect(result).toEqual({
        skip: 10,
        where: {},
        orderBy: {},
      });
    });

    it('should handle multiple sort orders', () => {
      // Arrange
      const query = {
        titleSortOrder: 'asc',
        createdAtSortOrder: 'desc',
        updatedAtSortOrder: 'asc',
      };

      // Act
      const result = PaginationUtil.toArgs(query);

      // Assert
      expect(result).toEqual({
        where: {},
        orderBy: {
          title: 'asc',
          createdAt: 'desc',
          updatedAt: 'asc',
        },
      });
    });

    it('should handle complex query with all parameter types', () => {
      // Arrange
      const query = {
        take: 20,
        skip: 40,
        nameSortOrder: 'desc',
        priceSortOrder: 'asc',
        category: 'electronics',
        inStock: true,
        brand: 'Apple',
        rating: 4.5,
      };

      // Act
      const result = PaginationUtil.toArgs(query);

      // Assert
      expect(result).toEqual({
        take: 20,
        skip: 40,
        where: {
          category: 'electronics',
          inStock: true,
          brand: 'Apple',
          rating: 4.5,
        },
        orderBy: {
          name: 'desc',
          price: 'asc',
        },
      });
    });

    it('should handle null and undefined values in where conditions', () => {
      // Arrange
      const query = {
        status: null,
        description: undefined,
        title: 'test',
      };

      // Act
      const result = PaginationUtil.toArgs(query);

      // Assert
      expect(result).toEqual({
        where: {
          status: null,
          description: undefined,
          title: 'test',
        },
        orderBy: {},
      });
    });
  });
});
