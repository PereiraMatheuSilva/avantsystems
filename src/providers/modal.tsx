"use client"

import { createContext, ReactNode, useState } from 'react';
import { ModalLicitacao } from '@/components/modal';
import { LicitacaoInfo } from '@/utils/licitacao';

interface ModalContextData{
  visible: boolean;
  handleModalVisible: ()=>void;
  licitacao: LicitacaoInfo | undefined
  setDetailLicitacao: (detail: LicitacaoInfo)=>void
}

export const ModalContext = createContext({} as ModalContextData)

export const ModalProvider = ({ children }:{children: ReactNode}) => {
  const [visible, setVisible] = useState(false);
  const [licitacao, setLicitacao] = useState<LicitacaoInfo>()


  function handleModalVisible(){
    setVisible(!visible)
  }

  function setDetailLicitacao(detail: LicitacaoInfo){
    console.log(detail);
    setLicitacao(detail);
  }

  return(
    <ModalContext.Provider value={{ 
      visible, 
      handleModalVisible, 
      licitacao, 
      setDetailLicitacao 
      }}>
      {visible && <ModalLicitacao />}
      {children}
    </ModalContext.Provider>
  )
}