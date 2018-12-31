<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Tables</h4>
          </md-card-header>
          <md-card-content>
            <table class="table">
              <thead>
              <tr>
                <th>Table number</th>
                <th>Created at</th>
                <th></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="table in tables" :key="table.id">
                <td class="pt-4">{{ table.table_number }}</td>
                <td class="pt-4">{{ table.created_at }}</td>
                <td>
                  <md-tooltip md-direction="top">Delete table</md-tooltip>
                  <md-button class="m-0 md-danger md-block" @click="deleteTable(table.table_number)"><md-icon>delete_outline</md-icon></md-button>
                </td>
              </tr>
              </tbody>
            </table>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>

import TablesAPI from "../../packages/api/Tables.js";
import toastr from 'toastr';
import _ from 'lodash';
import swal from "sweetalert";

export default {
  data() {
    return {
      tables: [],
    }
  },
  methods: {
    deleteTable(tableID){
      swal('DELETE TABLE', 'Are you sure you would like to delete this table?', 'warning',{
        buttons: {
          cancel: "NO",
          catch:{
            text: "YES",
            value: true
          }
        }
      }).then((value) => {
        if(value) {
          TablesAPI.deleteTable(tableID).then((r) => {
            if(r.status !== 200){
              toastr.error('There was an error deleting the table');
              return false;
            }

            const tables = this.tables.slice();
            _.remove(tables, (currTable) => {
              return currTable.table_number === tableID;
            });
            this.tables = tables;

            toastr.success('Table deleted successfully');
          });
        }
      });

    },
    getAllTables(){
      TablesAPI.getTables().then((tables) => {
        this.tables = tables.data;
      });
    },
  },
  created(){
    this.getAllTables();
  }
};
</script>
