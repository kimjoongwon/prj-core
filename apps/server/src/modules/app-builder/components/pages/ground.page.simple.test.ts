import { getGroundPage } from './ground.page';

describe('GroundPage - 기본 구조 검증', () => {
  it('ElementBuilder 구조로 변경되었는지 확인', () => {
    const result = getGroundPage('create');
    
    // elements 배열이 존재해야 함
    expect(result.elements).toBeDefined();
    expect(Array.isArray(result.elements)).toBe(true);
    expect(result.elements.length).toBe(1);
    
    // sections는 더 이상 사용하지 않음
    expect(result.sections).toBeUndefined();
  });

  it('ResourceBuilder가 elements를 사용하는지 확인', () => {
    const result = getGroundPage('create');
    
    const resourceBuilder = result.elements[0];
    expect(resourceBuilder.name).toBe('ResourceBuilder');
    expect(resourceBuilder.props.elements).toBeDefined();
    expect(resourceBuilder.props.sections).toBeUndefined();
  });

  it('기본 폼 구조가 유지되는지 확인', () => {
    const result = getGroundPage('create');
    
    const resourceBuilder = result.elements[0];
    const vStack = resourceBuilder.props.elements[0];
    const form = vStack.children[0];
    
    expect(vStack.name).toBe('VStack');
    expect(form.name).toBe('Form');
    expect(form.children).toBeDefined();
    expect(form.children.length).toBe(3); // VStack(inputs) + HStack(files) + Button
  });
});
