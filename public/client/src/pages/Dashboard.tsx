import React, { useState } from 'react';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Drawer,
    IconButton,
    List as MuiList,
    ListItemButton,
    ListItemIcon,
    ListItemText as MuiListItemText,
    Paper,
    Tab,
    Tabs,
    TextField,
    ThemeProvider,
    Toolbar,
    Typography,
    createTheme,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BadgeIcon from '@mui/icons-material/Badge';
import { useNavigate } from 'react-router-dom';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const navItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard' },
    { label: 'Risk', icon: <VerifiedUserIcon />, href: '/risk' },
    { label: 'KYC Verify', icon: <BadgeIcon />, href: '/kyc' },
];

type KycResponse = {
    fullName: string;
    bvn: {
        bvn: string;
        birthdate: string;
    };
    dob: string;
    verified: {
        state: string;
        status: string;
    };
};

function DashboardContent() {
    const [form, setForm] = useState({ bvn: '', firstname: '', lastname: '' });
    const [kyc, setKyc] = useState<KycResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tabValue, setTabValue] = useState(2); // KYC tab selected
    const [mobileOpen, setMobileOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setKyc(null);

        try {
            const res = await fetch('http://localhost:3000/api/kyc/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer-1509',
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error('Request failed');

            const data = await res.json();
            setKyc(data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch KYC data');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        const href = navItems[newValue]?.href;
        if (href) navigate(href);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ width: 250, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                Menu
            </Typography>
            <MuiList>
                {navItems.map(({ label, icon, href }) => (
                    <ListItemButton key={label} component="a" href={href}>
                        <ListItemIcon>{icon}</ListItemIcon>
                        <MuiListItemText primary={label} />
                    </ListItemButton>
                ))}
            </MuiList>
        </Box>
    );

    return (
        <>
            <AppBar position="sticky" color="primary">
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                            aria-label="open drawer"
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Client KYC Dashboard
                    </Typography>
                    {!isMobile && (
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            textColor="inherit"
                            indicatorColor="secondary"
                        >
                            {navItems.map(({ label }) => (
                                <Tab key={label} label={label} />
                            ))}
                        </Tabs>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
            >
                {drawer}
            </Drawer>

            <Box p={{ xs: 2, sm: 4 }}>
                <Paper elevation={3} sx={{ p: 3, maxWidth: 500, mb: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="BVN"
                            name="bvn"
                            value={form.bvn}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="First Name"
                            name="firstname"
                            value={form.firstname}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Last Name"
                            name="lastname"
                            value={form.lastname}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <Box mt={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={loading}
                                fullWidth
                            >
                                {loading ? <CircularProgress size={24} /> : 'Verify KYC'}
                            </Button>
                        </Box>
                    </form>
                </Paper>

                {error && (
                    <Typography color="error" textAlign="center" mb={2}>
                        {error}
                    </Typography>
                )}

                {kyc && (
                    <Card elevation={3} sx={{ maxWidth: 500, mx: 'auto' }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                                src="https://i.pravatar.cc/100?img=3"
                                sx={{ width: 64, height: 64 }}
                            />
                            <Box>
                                <Typography variant="h6">{kyc.fullName}</Typography>
                                <Typography><strong>BVN:</strong> {kyc.bvn.bvn}</Typography>
                                <Typography><strong>Date of Birth:</strong> {kyc.dob}</Typography>
                                <Typography><strong>State:</strong> {kyc.verified.state}</Typography>
                                <Typography><strong>Status:</strong> {kyc.verified.status}</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </>
    );
}

export default function Dashboard() {
    return (
        <ThemeProvider theme={darkTheme}>
            <DashboardContent />
        </ThemeProvider>
    );
}
