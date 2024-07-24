import { useEffect, useState } from "react";
import { PlusCircleTwoTone } from "@ant-design/icons";
import { Typography, Tooltip } from "antd";
const { Title } = Typography;
import { useLazyGetAllTablesQuery } from "../../stores/tableStore";
import TableCard from "./components/TableCard";
import CreateTableFormModal from "./modals/CreateTableFormModal";
import CreateOrderFormModal from "./modals/CreateOrderFormModal";

export default function Tables() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showCreateTableFormModal, setShowCreateTableFormModal] = useState(false);
  const [showCreateOrderFormModal, setShowCreateOrderFormModal] = useState(false);

  const [fetchTables, { data: tablesData, isLoading: tablesAreLoading }] = useLazyGetAllTablesQuery();

  useEffect(() => {
    fetchTables();
    if (!tablesData) return;
    setTables(tablesData && tablesData?.length > 0 ? tablesData : []);
  }, [tablesData]);

  return (
    <div style={{ width: "100%" }}>
      <header style={{ margin: "10px 0 20px 0", display: "flex", justifyContent: "space-between", padding: "0 35px" }}>
        <Title level={2}>Tables</Title>
        <Tooltip title="Create new Table" placement="left">
          <PlusCircleTwoTone
            onClick={() => setShowCreateTableFormModal(true)}
            style={{ fontSize: '26px' }}
            twoToneColor={"#73CF6B"}
          />
        </Tooltip>
      </header>
      <div style={{ display: "flex", flexWrap: "wrap", width: "100%" }}>
        {
          (!tablesAreLoading && tables.length > 0) && tables?.map(table => {
            return (
              <div
                key={table?._id}
                style={{ margin: "20px 10px" }}
              >
                <TableCard
                  tableData={table}
                  loading={tablesAreLoading}
                  onCreate={() => setShowCreateOrderFormModal(true)}
                  setSelectedTable={setSelectedTable}
                />
              </div>
            );
          })
        }
      </div>
      <CreateTableFormModal
        open={showCreateTableFormModal}
        onClose={() => {
          setShowCreateTableFormModal(false);
        }}
        refetch={fetchTables}
      />
      <CreateOrderFormModal
        open={showCreateOrderFormModal}
        onClose={() => {
          setShowCreateOrderFormModal(false);
        }}
        tableData={selectedTable}
        refetch={fetchTables}
      />
    </div>
  );
}
