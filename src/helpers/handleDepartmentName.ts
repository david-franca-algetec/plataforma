/**
 * Returns the translated department name based on the given type.
 * @param type - The department type to translate.
 * @returns The translated department name.
 */
export function handleDepartmentName(type: string): string {
  switch (type) {
    case "Scripting":
      return "Roteirização";
    case "Testing":
      return "Testes";
    case "Coding":
      return "Programação";
    case "Modeling":
      return "Modelagem";
    case "Designing":
      return "Design Gráfico";
    default:
      return type;
  }
}
