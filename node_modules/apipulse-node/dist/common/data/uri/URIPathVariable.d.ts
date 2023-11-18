declare class URIPathVariable {
    private variableId;
    private variableName;
    constructor(variableId: string, variableName: string);
    getVariableId(): string;
    setVariableId(variableId: string): void;
    getVariableName(): string;
    setVariableName(variableName: string): void;
}
export default URIPathVariable;
