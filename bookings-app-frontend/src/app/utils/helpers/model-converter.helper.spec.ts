import { ModelConverter } from './model-converter.helper';

describe('ModelConverter', () => {
    it('should create an instance', () => {
        expect(new ModelConverter<any, any>((_) => _)).toBeTruthy();
    });
});
