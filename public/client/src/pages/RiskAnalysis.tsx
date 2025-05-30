import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Paper,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    createTheme,
    ThemeProvider,
    useTheme,
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List as MuiList,
    ListItemButton,
    ListItemIcon,
    ListItemText as MuiListItemText,
    Tabs,
    Tab,
    useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import BadgeIcon from '@mui/icons-material/Badge';

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from 'recharts';

const COLORS = ['#0088FE', '#FF8042', '#00C49F'];
const SCORE_COLORS = {
    incomeScore: '#4caf50',
    disposableIncomeScore: '#2196f3',
    gamblingPenalty: '#f44336',
    largeCashPenalty: '#ff9800',
    reversalPenalty: '#9c27b0',
};

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const navItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, href: '/dashboard' },
    { label: 'Verify', icon: <VerifiedUserIcon />, href: '/' },
    { label: 'KYC', icon: <BadgeIcon />, href: '/kyc' },
];

function RiskAnalysisContent() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const [accountId, setAccountId] = useState('');
    const [riskData, setRiskData] = useState(null);
    const [scoringData, setScoringData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [tabValue, setTabValue] = useState(1); // 1 = Verify tab by default

    const handleFetch = async () => {
        if (!accountId.trim()) return;
        setLoading(true);
        setError('');
        setRiskData(null);
        setScoringData(null);

        try {
            const riskRes = await fetch(`http://localhost:3000/api/risk/${accountId}`, {
                headers: { Authorization: 'Bearer-1509' },
            });
            if (!riskRes.ok) throw new Error('Failed to fetch risk data');
            const riskJson = await riskRes.json();
            setRiskData(riskJson);

            const scoreRes = await fetch(`http://localhost:3000/api/scoring/${accountId}`, {
                headers: { Authorization: 'Bearer-1509' },
            });
            if (!scoreRes.ok) throw new Error('Failed to fetch scoring data');
            const scoreJson = await scoreRes.json();
            setScoringData(scoreJson);
        } catch (err) {
            setError('Could not retrieve risk or scoring data.');
        } finally {
            setLoading(false);
        }
    };

    const pieData = riskData
        ? [
            { name: 'Gambling Tx', value: riskData.gamblingTxCount },
            { name: 'Large Credits', value: riskData.largeCashCreditsCount },
            { name: 'Reversals', value: riskData.reversalsCount },
        ]
        : [];

    const barData = riskData
        ? [
            {
                name: 'Transactions',
                Credits: riskData.totalCredits,
                Debits: riskData.totalDebits,
            },
        ]
        : [];

    const scoringBarData = scoringData
        ? Object.entries(scoringData.breakdown).map(([name, value]) => ({
            name,
            value: Math.abs(value),
            positive: value > 0,
        }))
        : [];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        const href = navItems[newValue]?.href;
        if (href) {
            navigate(href); // ✅ client-side route change without reload
        }
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
                        Risk Analysis
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
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
            >
                {drawer}
            </Drawer>

            {/* Main container */}
            <Box p={{ xs: 2, sm: 4 }} maxWidth="480px" mx="auto" mb={5}>
                {/* Form */}
                <Paper sx={{ p: 3, mb: 5 }} elevation={3}>
                    <TextField
                        fullWidth
                        label="Account ID"
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
                        margin="normal"
                        autoComplete="off"
                    />
                    <Box mt={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleFetch}
                            disabled={loading || !accountId.trim()}
                            fullWidth
                            size="large"
                        >
                            {loading ? <CircularProgress size={24} /> : 'Analyze Risk'}
                        </Button>
                    </Box>
                    {error && (
                        <Typography color="error" mt={2} textAlign="center">
                            {error}
                        </Typography>
                    )}
                </Paper>

                {(riskData || scoringData) && (
                    <Box display="flex" flexDirection="column" gap={4}>
                        {/* Top row: Disposable Income + Credit vs Debit */}
                        <Box
                            display="flex"
                            flexDirection={{ xs: 'column', sm: 'row' }}
                            gap={3}
                        >
                            {riskData && (
                                <Card
                                    sx={{
                                        borderRadius: '50%',
                                        width: { xs: '100%', sm: '45%' },
                                        height: 160,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                        mx: 'auto',
                                        flexShrink: 0,
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="body1">Disposable Income</Typography>
                                        <Typography variant="h4" color="primary">
                                            {(riskData.disposableIncomeRatio * 100).toFixed(2)}%
                                        </Typography>
                                    </CardContent>
                                </Card>
                            )}

                            {riskData && (
                                <Paper
                                    sx={{
                                        flex: 1,
                                        height: 300,
                                        p: 2,
                                        minWidth: 0,
                                    }}
                                    elevation={3}
                                >
                                    <Typography variant="subtitle1" mb={1}>
                                        Credit vs Debit
                                    </Typography>
                                    <ResponsiveContainer width="100%" height="90%">
                                        <BarChart data={barData}>
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="Credits" fill="#4caf50" barSize={20} />
                                            <Bar dataKey="Debits" fill="#f44336" barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Paper>
                            )}
                        </Box>

                        {/* Bottom row: Score Breakdown + Risk Indicators */}
                        <Box
                            display="flex"
                            flexDirection={{ xs: 'column', sm: 'row' }}
                            gap={3}
                        >
                            {scoringData && (
                                <Paper
                                    sx={{
                                        flex: 1,
                                        p: 3,
                                        minWidth: 0,
                                    }}
                                    elevation={3}
                                >
                                    <Typography variant="h6" mb={2} textAlign="center">
                                        Score: {scoringData.score}
                                    </Typography>
                                    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                                        <Box flex={1} sx={{ minWidth: 280 }}>
                                            <List dense>
                                                {Object.entries(scoringData.breakdown).map(([key, val]) => (
                                                    <ListItem key={key} sx={{ py: 0.5 }}>
                                                        <ListItemText
                                                            primary={key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())}
                                                            secondary={`Score: ${val}`}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>

                                    </Box>
                                    <Box flex={1} sx={{ height: 240, minWidth: 200 }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={scoringBarData}>
                                                <XAxis
                                                    dataKey="name"
                                                    tickFormatter={(str) => str.replace(/([A-Z])/g, ' $1').trim()}
                                                />
                                                <YAxis />
                                                <Tooltip />
                                                <Bar dataKey="value" barSize={20}>
                                                    {scoringBarData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.positive ? SCORE_COLORS[entry.name] : '#b71c1c'}
                                                        />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Paper>
                            )}

                            {riskData && (
                                <Paper
                                    sx={{
                                        flex: 1,
                                        height: 300,
                                        p: 2,
                                        minWidth: 0,
                                    }}
                                    elevation={3}
                                >
                                    <Typography variant="subtitle1" mb={1}>
                                        Risk Indicators
                                    </Typography>
                                    <ResponsiveContainer width="100%" height="90%">
                                        <PieChart>
                                            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius="80%" label>
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Paper>
                            )}
                        </Box>
                    </Box>
                )}
            </Box>
        </>
    );
}

export default function RiskAnalysis() {
    return (
        <ThemeProvider theme={darkTheme}>
            <RiskAnalysisContent />
        </ThemeProvider>
    );
}
