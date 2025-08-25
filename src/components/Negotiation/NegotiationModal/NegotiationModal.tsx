"use client";

import React, { useState } from "react";
import { 
  X, 
  CheckCircle, 
  Clock, 
  FileText, 
  CreditCard, 
  AlertCircle,
  Download,
  Send
} from "lucide-react";
import Button from "../../ui/Button/Button";
import type { SimulacaoRegistro } from "../../../types/negociacao";
import "./NegotiationModal.css";

interface NegotiationModalProps {
  isOpen: boolean;
  onClose: () => void;
  simulation: SimulacaoRegistro | null;
  cnpjData: {
    cnpj: string;
    nomeFantasia?: string;
  };
}

type NegotiationStep = "terms" | "documents" | "payment" | "confirmation" | "success";

const NegotiationModal: React.FC<NegotiationModalProps> = ({
  isOpen,
  onClose,
  simulation,
  cnpjData
}) => {
  const [currentStep, setCurrentStep] = useState<NegotiationStep>("terms");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"boleto" | "pix" | "cartao">("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !simulation) return null;

  const steps = [
    { id: "terms", label: "Termos", icon: <FileText size={16} /> },
    { id: "documents", label: "Documentos", icon: <FileText size={16} /> },
    { id: "payment", label: "Pagamento", icon: <CreditCard size={16} /> },
    { id: "confirmation", label: "Confirmação", icon: <CheckCircle size={16} /> },
  ];

  const stepIndex = steps.findIndex(step => step.id === currentStep);

  const handleNext = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id as NegotiationStep);
    }
  };

  const handlePrevious = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as NegotiationStep);
    }
  };

  const handleFinishNegotiation = async () => {
    setIsProcessing(true);
    // Simula processamento
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCurrentStep("success");
    setIsProcessing(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "terms":
        return (
          <div className="neg-step-content">
            <div className="step-header">
              <h3>Termos da Negociação</h3>
              <p>Revise os termos e condições para prosseguir</p>
            </div>
            
            <div className="terms-summary">
              <div className="summary-card">
                <h4>Resumo da Negociação</h4>
                <div className="summary-details">
                  <div className="detail-row">
                    <span>CNPJ:</span>
                    <strong>{simulation.cnpj}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Empresa:</span>
                    <strong>{cnpjData.nomeFantasia || "Empresa"}</strong>
                  </div>
                  <div className="detail-row">
                    <span>Valor Original:</span>
                    <strong>
                      {simulation.resultado.valorTotalOriginal.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </strong>
                  </div>
                  <div className="detail-row">
                    <span>Desconto:</span>
                    <strong className="highlight">
                      {simulation.resultado.descontoPercentual}% - 
                      {simulation.resultado.descontoValor.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </strong>
                  </div>
                  <div className="detail-row">
                    <span>Valor Final:</span>
                    <strong className="total">
                      {simulation.resultado.valorComDesconto.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </strong>
                  </div>
                  <div className="detail-row">
                    <span>Parcelas:</span>
                    <strong>
                      {simulation.resultado.parcelas}x de{" "}
                      {simulation.resultado.valorParcela.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="terms-text">
                <h5>Condições Gerais:</h5>
                <ul>
                  <li>O pagamento deverá ser realizado nas datas acordadas</li>
                  <li>Em caso de atraso, poderão ser aplicados juros e multa</li>
                  <li>A quitação total regularizará a situação fiscal do CNPJ</li>
                  <li>Certidões negativas serão liberadas após confirmação do pagamento</li>
                  <li>Esta proposta tem validade de 30 dias</li>
                </ul>
              </div>

              <label className="terms-checkbox">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <span>Aceito os termos e condições da negociação</span>
              </label>
            </div>
          </div>
        );

      case "documents":
        return (
          <div className="neg-step-content">
            <div className="step-header">
              <h3>Documentos Necessários</h3>
              <p>Baixe e assine os documentos para formalizar a negociação</p>
            </div>

            <div className="documents-list">
              <div className="document-item">
                <div className="doc-info">
                  <FileText size={24} />
                  <div>
                    <h4>Termo de Confissão de Dívida</h4>
                    <p>Documento oficial da negociação</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  <Download size={16} />
                  Baixar
                </Button>
              </div>

              <div className="document-item">
                <div className="doc-info">
                  <FileText size={24} />
                  <div>
                    <h4>Contrato de Parcelamento</h4>
                    <p>Detalhes do parcelamento acordado</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  <Download size={16} />
                  Baixar
                </Button>
              </div>

              <div className="document-item">
                <div className="doc-info">
                  <FileText size={24} />
                  <div>
                    <h4>Demonstrativo de Débitos</h4>
                    <p>Detalhamento dos valores negociados</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm">
                  <Download size={16} />
                  Baixar
                </Button>
              </div>
            </div>

            <div className="upload-section">
              <h4>Envio de Documentos Assinados</h4>
              <div className="upload-area">
                <div className="upload-placeholder">
                  <Send size={32} />
                  <p>Arraste os documentos assinados aqui ou clique para selecionar</p>
                  <Button variant="outline" size="sm">
                    Selecionar Arquivos
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="neg-step-content">
            <div className="step-header">
              <h3>Forma de Pagamento</h3>
              <p>Escolha como deseja pagar as parcelas</p>
            </div>

            <div className="payment-options">
              <label className={`payment-option ${selectedPaymentMethod === "pix" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  value="pix"
                  checked={selectedPaymentMethod === "pix"}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value as "pix")}
                />
                <div className="option-content">
                  <div className="option-header">
                    <strong>PIX</strong>
                    <span className="badge discount">5% desconto</span>
                  </div>
                  <p>Pagamento instantâneo via PIX</p>
                  <p className="highlight">Valor com desconto: {(simulation.resultado.valorComDesconto * 0.95).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                </div>
              </label>

              <label className={`payment-option ${selectedPaymentMethod === "boleto" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  value="boleto"
                  checked={selectedPaymentMethod === "boleto"}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value as "boleto")}
                />
                <div className="option-content">
                  <div className="option-header">
                    <strong>Boleto Bancário</strong>
                  </div>
                  <p>Pagamento tradicional via boleto</p>
                  <p>Vencimento: 5 dias úteis após confirmação</p>
                </div>
              </label>

              <label className={`payment-option ${selectedPaymentMethod === "cartao" ? "selected" : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cartao"
                  checked={selectedPaymentMethod === "cartao"}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value as "cartao")}
                />
                <div className="option-content">
                  <div className="option-header">
                    <strong>Cartão de Crédito</strong>
                  </div>
                  <p>Débito automático mensal no cartão</p>
                  <p>Parcelamento automático garantido</p>
                </div>
              </label>
            </div>

            {selectedPaymentMethod && (
              <div className="payment-details">
                <h4>Detalhes do Pagamento</h4>
                <div className="payment-summary">
                  <div className="summary-row">
                    <span>Forma de pagamento:</span>
                    <strong>
                      {selectedPaymentMethod === "pix" && "PIX"}
                      {selectedPaymentMethod === "boleto" && "Boleto Bancário"}
                      {selectedPaymentMethod === "cartao" && "Cartão de Crédito"}
                    </strong>
                  </div>
                  <div className="summary-row">
                    <span>Primeira parcela:</span>
                    <strong>
                      {selectedPaymentMethod === "pix" 
                        ? (simulation.resultado.valorComDesconto * 0.95).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                        : simulation.resultado.valorParcela.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                      }
                    </strong>
                  </div>
                  <div className="summary-row">
                    <span>Vencimento:</span>
                    <strong>
                      {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")}
                    </strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case "confirmation":
        return (
          <div className="neg-step-content">
            <div className="step-header">
              <h3>Confirmação Final</h3>
              <p>Revise todos os dados antes de finalizar</p>
            </div>

            <div className="final-summary">
              <div className="summary-section">
                <h4>Dados da Negociação</h4>
                <div className="summary-grid">
                  <div className="summary-item">
                    <label>CNPJ:</label>
                    <span>{simulation.cnpj}</span>
                  </div>
                  <div className="summary-item">
                    <label>Empresa:</label>
                    <span>{cnpjData.nomeFantasia || "Empresa"}</span>
                  </div>
                  <div className="summary-item">
                    <label>Valor Total:</label>
                    <span>
                      {selectedPaymentMethod === "pix" 
                        ? (simulation.resultado.valorComDesconto * 0.95).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                        : simulation.resultado.valorComDesconto.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                      }
                    </span>
                  </div>
                  <div className="summary-item">
                    <label>Parcelas:</label>
                    <span>
                      {selectedPaymentMethod === "pix" ? "À vista" : `${simulation.resultado.parcelas}x`}
                    </span>
                  </div>
                  <div className="summary-item">
                    <label>Forma de Pagamento:</label>
                    <span>
                      {selectedPaymentMethod === "pix" && "PIX"}
                      {selectedPaymentMethod === "boleto" && "Boleto"}
                      {selectedPaymentMethod === "cartao" && "Cartão"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="warning-box">
                <AlertCircle size={20} />
                <div>
                  <strong>Atenção:</strong>
                  <p>Ao confirmar, você estará formalizando esta negociação e se comprometendo com os termos acordados.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="neg-step-content success-content">
            <div className="success-icon">
              <CheckCircle size={64} />
            </div>
            <h3>Negociação Confirmada!</h3>
            <p>Sua negociação foi formalizada com sucesso.</p>
            
            <div className="success-details">
              <h4>Próximos Passos:</h4>
              <ul>
                <li>Você receberá um e-mail com os detalhes da negociação</li>
                <li>Os boletos/PIX serão enviados conforme cronograma</li>
                <li>Acompanhe o status no painel do cliente</li>
                <li>Certidões negativas serão liberadas após confirmação do pagamento</li>
              </ul>
            </div>

            <div className="success-actions">
              <Button variant="primary" onClick={onClose}>
                Voltar ao Painel
              </Button>
              <Button variant="secondary">
                <Download size={16} />
                Baixar Comprovante
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="neg-modal-overlay">
      <div className="neg-modal">
        <div className="neg-modal-header">
          <h2>Negociação de Débitos</h2>
          <button className="close-btn" onClick={onClose} type="button">
            <X size={24} />
          </button>
        </div>

        {currentStep !== "success" && (
          <div className="neg-steps">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`step ${index <= stepIndex ? "active" : ""} ${
                  index === stepIndex ? "current" : ""
                }`}
              >
                <div className="step-icon">{step.icon}</div>
                <span className="step-label">{step.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="neg-modal-content">
          {renderStepContent()}
        </div>

        {currentStep !== "success" && (
          <div className="neg-modal-footer">
            <div className="footer-left">
              {stepIndex > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  Anterior
                </Button>
              )}
            </div>
            <div className="footer-right">
              {currentStep === "terms" && (
                <Button 
                  variant="primary" 
                  onClick={handleNext}
                  disabled={!acceptedTerms}
                >
                  Prosseguir
                </Button>
              )}
              {currentStep === "documents" && (
                <Button variant="primary" onClick={handleNext}>
                  Continuar
                </Button>
              )}
              {currentStep === "payment" && (
                <Button 
                  variant="primary" 
                  onClick={handleNext}
                  disabled={!selectedPaymentMethod}
                >
                  Continuar
                </Button>
              )}
              {currentStep === "confirmation" && (
                <Button 
                  variant="primary" 
                  onClick={handleFinishNegotiation}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Clock size={16} />
                      Processando...
                    </>
                  ) : (
                    "Confirmar Negociação"
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NegotiationModal;
