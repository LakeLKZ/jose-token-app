import { Component } from '@angular/core';
import { ethers } from 'ethers';

@Component({
  selector: 'app-jose-token',
  templateUrl: './jose-token.component.html'
})
export class JoseTokenComponent {
  walletAddress = '';
  tokenBalance = '-';
  recipient = '';
  amount: number = 0;
  status = '';

  // 👇 Reemplazá con tu contrato real
  contractAddress = '0x0b7da89d27a29ab50e4c0Ec413a7965c16771e19';
  contractABI = [
    'function transfer(address to, uint amount) public returns (bool)',
    'function balanceOf(address account) public view returns (uint256)',
    'function symbol() public view returns (string)'
  ];

  provider: any;
  signer: any;
  tokenContract: any;

  async connectWallet() {
    if ((window as any).ethereum) {
      this.provider = new ethers.BrowserProvider((window as any).ethereum);
      await this.provider.send("eth_requestAccounts", []);
      this.signer = await this.provider.getSigner();
      this.walletAddress = await this.signer.getAddress();
      this.tokenContract = new ethers.Contract(this.contractAddress, this.contractABI, this.signer);
      this.updateBalance();
    } else {
      this.status = '🦊 Instala MetaMask para continuar';
    }
  }

  async updateBalance() {
    const balance = await this.tokenContract.balanceOf(this.walletAddress);
    const symbol = await this.tokenContract.symbol();
    this.tokenBalance = `${balance} ${symbol}`;
  }

  async sendTokens() {
    if (!this.recipient || !this.amount) {
      this.status = '❌ Completá los campos.';
      return;
    }

    try {
      const tx = await this.tokenContract.transfer(this.recipient, this.amount);
      this.status = '⏳ Enviando...';
      await tx.wait();
      this.status = '✅ ¡Transferencia exitosa!';
      this.updateBalance();
    } catch (err: any) {
      console.error(err);
      this.status = '❌ Error al enviar tokens.';
    }
  }
}
