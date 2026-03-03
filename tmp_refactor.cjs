const fs = require('fs');

const appFile = 'src/App.jsx';
let content = fs.readFileSync(appFile, 'utf8');

// Strip out GlobalStyles
content = content.replace(/const GlobalStyles \= \(\) \=\> \{[\s\S]*?\n\};\n/g, '');

// Strip out AnimatedCounter
content = content.replace(/function AnimatedCounter\(\{[^\}]*\}\) \{[\s\S]*?^}\n/m, '');

// Strip out PulseDot
content = content.replace(/function PulseDot\(\{[^\}]*\}\) \{[\s\S]*?^}\n/m, '');

// Strip out NavButton
content = content.replace(/function NavButton\(\{[^\}]*\}\) \{[\s\S]*?^}\n/m, '');

// Strip out StatCard
content = content.replace(/function StatCard\(\{[^\}]*\}\) \{[\s\S]*?^}\n/m, '');

// Strip out StatusBadge
content = content.replace(/function StatusBadge\(\{[^\}]*\}\) \{[\s\S]*?^}\n/m, '');

// Strip out PrescriptionStatusBadge
content = content.replace(/function PrescriptionStatusBadge\(\{[^\}]*\}\) \{[\s\S]*?^}\n/m, '');

// Strip out ActionButton
content = content.replace(/function ActionButton\(\{[^\}]*\}\) \{[\s\S]*?^}\n/m, '');

// Strip out PaginationFooter
content = content.replace(/function PaginationFooter\(\{[^\}]*\}\) \{[\s\S]*?^}\n/m, '');

// Strip out MobileMenu
content = content.replace(/function MobileMenu\(\{[^\}]*\}\) \{[\s\S]*?^}\n/m, '');

// Strip out ConfirmationModal
content = content.replace(/function ConfirmationModal\(\{[^\}]*\}\) \{[\s\S]*?^}\n/m, '');

// Strip out PasswordModal
content = content.replace(/function PasswordModal\(\{[^\}]*\}\) \{[\s\S]*?^}\n/m, '');

// Strip out BroadcastModal
content = content.replace(/function BroadcastModal\(\{[^\}]*\}\) \{[\s\S]*?^}\n/m, '');

// Strip out TopPrescribedChart
content = content.replace(/function TopPrescribedChart\(\{[^\}]*\}\) \{[\s\S]*?^}\n/m, '');

// Strip out TableContainer
content = content.replace(/function TableContainer\(\{[^\}]*\}\) \{[\s\S]*?^}\n/m, '');

// Strip out TableHeader
content = content.replace(/function TableHeader\(\{[^\}]*\}\) \{[\s\S]*?^}\n/m, '');

// Strip out InventoryView
content = content.replace(/function InventoryView\(\{[^\}]*\}\) \{[\s\S]*?^}\n/m, '');

// Strip out SupportView
content = content.replace(/function SupportView\(\{[^\}]*\}\) \{[\s\S]*?^}\n/m, '');

// Strip out DoctorsView
content = content.replace(/function DoctorsView\(\{[^\}]*\}\) \{[\s\S]*?^}\n/m, '');

// Strip out MachinesView
content = content.replace(/function MachinesView\(\{[^\}]*\}\) \{[\s\S]*?^}\n/m, '');

// Strip out TransactionsView
content = content.replace(/function TransactionsView\(\{[^\}]*\}\) \{[\s\S]*?^}\n/m, '');

// Strip out AuditView
content = content.replace(/function AuditView\(\{[^\}]*\}\) \{[\s\S]*?^}\n/m, '');

// Strip out SettingsView
content = content.replace(/function SettingsView\(\{[^\}]*\}\) \{[\s\S]*?^}\n/m, '');

// Now we define the imports correctly
const imports = `
import { app, db, auth } from './config/firebase'; // Assuming extracted here previously!

import GlobalStyles from './components/GlobalStyles';
import { AnimatedCounter, PulseDot, NavButton, StatCard, StatusBadge, PrescriptionStatusBadge, ActionButton, PaginationFooter, TableContainer, TableHeader } from './components/UI';
import { ConfirmationModal, PasswordModal, BroadcastModal, MobileMenu } from './components/Modals';
import { DoctorsView } from './views/DoctorsView';
import { InventoryView } from './views/InventoryView';
import { TransactionsView } from './views/TransactionsView';
import { MachinesView } from './views/MachinesView';
import { AuditView } from './views/AuditView';
import { SupportView } from './views/SupportView';
import { SettingsView } from './views/SettingsView';
import { TopPrescribedChart } from './views/TopPrescribedChart';
`;

// Insert imports right after lucide-react or existing react imports
content = content.replace(/import \{[\s\S]*?\} from 'lucide-react';\n/, match => match + imports + '\n');

// Clean up redundant section headers like // ==== 1. HELPER COMPONENTS ===
content = content.replace(/\/\/ ==========================================\n\/\/ \d+\. [\s\S]*?\n\/\/ ==========================================\n/g, '');

fs.writeFileSync(appFile, content);
console.log('App.jsx has been successfully refactored!');
