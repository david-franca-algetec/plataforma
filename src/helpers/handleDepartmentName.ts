export const handleDepartmentName = (type: string) => {
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
};
