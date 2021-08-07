import { UserShortInterface } from "data/@types/UserInterface";
import { ApiService } from "data/services/ApiServeces";
import { ValidationService } from "data/services/ValidationsServices";
import { useState, useMemo } from "react";

export default function useIndex() {
  const [cep, setCep] = useState(""),
    cepValido = useMemo(() => {
      return ValidationService.cep(cep);
    }, [cep]),
    [erro, setErro] = useState(""),
    [buscaFeita, setBuscaFeita] = useState(false),
    [carregando, setCarregando] = useState(false),
    [diaristas, setDiaristas] = useState([] as UserShortInterface[]),
    [diaristasRestantes, setDiaristasRestantes] = useState(0);

  async function buscarProfissionais(cep: string) {
    setBuscaFeita(false);
    setCarregando(true);
    try {
      setErro("");
      const { data } = await ApiService.get<{
        diaristas: UserShortInterface[];
        quantidade_diaristas: number;
      }>("/api/diaristas-cidade?cep=" + cep.replace(/\D/g, ""));

      setBuscaFeita(true);
      setDiaristas(data.diaristas);
      setDiaristasRestantes(data.quantidade_diaristas);
      setCarregando(false);
    } catch (error) {
      setErro("CEP não encontrado");
      setCarregando(false);
    }
  }

  return {
    cep,
    setCep,
    cepValido,
    buscarProfissionais,
    erro,
    diaristas,
    buscaFeita,
    carregando,
    diaristasRestantes,
  };
}
