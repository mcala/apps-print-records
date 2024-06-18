import {
    initializeBlock,
    Button,
    useBase,
    useRecords,
    useGlobalConfig,
    Box,
    CellRenderer,
    Heading,
    Icon,
    Text,
    ViewPickerSynced,
    useViewMetadata,
} from '@airtable/blocks/ui';
import React from 'react';
import styled from 'styled-components'
import printWithoutElementsWithClass from './css';

const GlobalConfigKeys = {
    VIEW_ID: 'viewId',
};

const StyledTable = styled.table`
	width: 100%;
	border-collapse: collapse;
	margin: 25px 0;
	font-size: 14px;
	text-align: left;
`;

const StyledTh = styled.th`
	border: 1px solid #dddddd;
	padding: 8px;
/*	background-color: #f2f2f2;*/
`;

const StyledTd = styled.td`
	border: 1px solid #dddddd;
	padding: 8px;
`;

const StyledTr = styled.tr`
/*	&:nth-child(even) {
		background-color: #f9f9f9;
	}*/
`;

const StyledRowNumberTd = styled(StyledTd)`
	font-weight: bold;
	text-align: center;
`;

function PrintRecordsApp() {
    const base = useBase();
    const globalConfig = useGlobalConfig();

    // We want to render the list of records in this table.
    const table = base.getTableByName('OLS Bill Information');

    // The view ID is stored in globalConfig using ViewPickerSynced.
    const viewId = globalConfig.get(GlobalConfigKeys.VIEW_ID);

    // The view may have been deleted, so we use getViewByIdIfExists
    // instead of getViewById. getViewByIdIfExists will return null
    // if the view doesn't exist.
    const view = table.getViewByIdIfExists(viewId);

    return (
        <div>
            <Toolbar table={table} />
            <Box margin={3}>
                <Report view={view} />
            </Box>
        </div>
    );
}

// The toolbar contains the view picker and print button.
function Toolbar({ table }) {
    return (
        <Box className="print-hide" padding={2} borderBottom="thick" display="flex">
            <ViewPickerSynced table={table} globalConfigKey={GlobalConfigKeys.VIEW_ID} />
            <Button
                onClick={() => {
                    // Inject CSS to hide elements with the "print-hide" class name
                    // when the app gets printed. This lets us hide the toolbar from
                    // the print output.
                    printWithoutElementsWithClass('print-hide');
                }}
                marginLeft={2}
            >
                Print
            </Button>
        </Box>
    );
}

// Renders a <Record> for each of the records in the specified view.
function Report({ view }) {
    const records = useRecords(view);
    const fields = useViewMetadata(view);

    if (!view) {
        return <div>Pick a view</div>;
    }

    return (
        <div>
            <Box marginY={3}>
                <StyledTable>
                    <thead>
                        <StyledTr>
                            <StyledTh></StyledTh>
                            {fields.visibleFields.map(field => (
                                <StyledTh key={field.id}>{field.name}</StyledTh>
                            ))}
                        </StyledTr>
                    </thead>
                    <tbody>
                        {records.map((record, index) => (
                            <StyledTr key={record.id}>
                                <StyledRowNumberTd>{index + 1}</StyledRowNumberTd>
                                {fields.visibleFields.map(field => (
                                    <StyledTd key={field.id}>{record.getCellValueAsString(field.name)}</StyledTd>
                                ))}
                            </StyledTr>
                        ))}
                    </tbody>
                </StyledTable>
            </Box>
        </div>
    );
}

function Record({ record }) {
    return (
        <Box marginY={3}>
            <table>
                <heading>TEST</heading>
                <thead>
                    <tr>
                        <th>Summary</th>
                        <th>BillType</th>
                    </tr>
                </thead>
                <tr>
                    <td>
                        {record.getCellValue("Hacky_Summary")}
                    </td>
                    <td>
                        {record.getCellValue("Bill Type")}
                    </td>
                </tr>
            </table>
        </Box>
    )

}

// Renders a single record from the Collections table with each
// of its linked Artists records.
//function Record({record}) {
//    const base = useBase();
//
//    // Each record in the "Collections" table is linked to records
//    // in the "Artists" table. We want to show the Artists for
//    // each collection.
//    const linkedTable = base.getTableByName('OLS Bill Information');
//    const linkedRecords = useRecords(
//        record.selectLinkedRecordsFromCell('OLS Bill Information', {
//            // Keep the linked records sorted by their primary field.
//            sorts: [{field: linkedTable.primaryField, direction: 'asc'}],
//        }),
//    );
//
//    return (
//        <Box marginY={3}>
//            <Heading>{record.name}</Heading>
//            <table style={{borderCollapse: 'collapse', width: '100%'}}>
//                <thead>
//                    <tr>
//                        <td
//                            style={{
//                                whiteSpace: 'nowrap',
//                                verticalAlign: 'bottom',
//                            }}
//                        >
//                            <Heading variant="caps" size="xsmall" marginRight={3} marginBottom={0}>
//                                On display?
//                            </Heading>
//                        </td>
//                        <td style={{width: '50%', verticalAlign: 'bottom'}}>
//                            <Heading variant="caps" size="xsmall" marginRight={3} marginBottom={0}>
//                                Artist name
//                            </Heading>
//                        </td>
//                        <td style={{width: '50%', verticalAlign: 'bottom'}}>
//                            <Heading variant="caps" size="xsmall" marginBottom={0}>
//                                Artworks
//                            </Heading>
//                        </td>
//                    </tr>
//                </thead>
//                <tbody>
//                    {linkedRecords.map(linkedRecord => {
//                        // Render a check or an x depending on if the artist is on display or not.
//                        const isArtistOnDisplay = linkedRecord.getCellValue('On Display?');
//                        return (
//                            <tr key={linkedRecord.id} style={{borderTop: '2px solid #ddd'}}>
//                                <td style={{textAlign: 'center', whiteSpace: 'nowrap'}}>
//                                    <Box
//                                        display="inline-flex"
//                                        alignItems="center"
//                                        justifyContent="center"
//                                        width="16px"
//                                        height="16px"
//                                        marginRight={3}
//                                        borderRadius="100%"
//                                        backgroundColor={isArtistOnDisplay ? 'green' : 'red'}
//                                        textColor="white"
//                                    >
//                                        <Icon name={isArtistOnDisplay ? 'check' : 'x'} size={12} />
//                                    </Box>
//                                </td>
//                                <td style={{width: '50%'}}>
//                                    <Text marginRight={3}>{linkedRecord.name}</Text>
//                                </td>
//                                <td style={{width: '50%'}}>
//                                    <CellRenderer
//                                        record={linkedRecord}
//                                        field={linkedTable.getFieldByName('Attachments')}
//                                    />
//                                </td>
//                            </tr>
//                        );
//                    })}
//                </tbody>
//            </table>
//        </Box>
//    );
//}

initializeBlock(() => <PrintRecordsApp />);
