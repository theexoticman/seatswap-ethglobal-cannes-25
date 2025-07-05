import React from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CheckCircle, ExternalLink } from 'lucide-react'

const MintingSuccessModal = ({ isOpen, onClose, txHash }) => {
  if (!isOpen) return null;

  const explorerUrl = `https://sepolia.etherscan.io/tx/${txHash}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle className="sr-only">Minting Successful</DialogTitle>
        <DialogDescription className="sr-only">Your ticket has been successfully minted as an NFT.</DialogDescription>
        
        <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
          <CheckCircle className="w-24 h-24 text-green-500" />
          <h2 className="text-2xl font-bold">Your Plane Ticket NFT Minted Successfully!</h2>
          <p className="text-muted-foreground">Your ticket is now an NFT on the blockchain.</p>
          
          {txHash && (
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-4"
            >
              View on Etherscan
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          )}
          
          <Button onClick={onClose} className="mt-6 w-1/2">
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MintingSuccessModal 