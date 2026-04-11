import { mapBenefitLevelToCoverage } from '@src/helpers/healthInsurance';

describe('healthInsurance helper', () => {
    describe('mapBenefitLevelToCoverage', () => {
        it('should return 100 for benefit level 1', () => {
            expect(mapBenefitLevelToCoverage(1)).toBe(100);
        });

        it('should return 100 for benefit level 2', () => {
            expect(mapBenefitLevelToCoverage(2)).toBe(100);
        });

        it('should return 95 for benefit level 3', () => {
            expect(mapBenefitLevelToCoverage(3)).toBe(95);
        });

        it('should return 80 for benefit level 4', () => {
            expect(mapBenefitLevelToCoverage(4)).toBe(80);
        });

        it('should return 100 for benefit level 5', () => {
            expect(mapBenefitLevelToCoverage(5)).toBe(100);
        });

        it('should return 0 for unknown benefit level', () => {
            expect(mapBenefitLevelToCoverage(99)).toBe(0);
        });
    });
});
