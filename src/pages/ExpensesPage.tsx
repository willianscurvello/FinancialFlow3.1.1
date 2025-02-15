import React, { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase'; // Importar o cliente Supabase

interface Expense {
  id: number;
  description: string;
  category: string;
  employee: string;
  cardLastFour: string;
  date: string;
  amount: number;
  receiptLink: string;
  consolidated: boolean;
}

export function ExpensesPage() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState<Expense>({
    id: 0,
    description: '',
    category: '',
    employee: '',
    cardLastFour: '',
    date: '',
    amount: 0,
    receiptLink: '',
    consolidated: false,
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('expenses')
      .insert([{ 
        description: newExpense.description,
        category: newExpense.category,
        employee: newExpense.employee,
        cardLastFour: newExpense.cardLastFour,
        date: newExpense.date,
        amount: newExpense.amount,
        receiptLink: newExpense.receiptLink,
        consolidated: newExpense.consolidated,
      }]);

    if (error) {
      console.error('Error adding expense:', error);
    } else {
      setExpenses([...expenses, { ...newExpense, id: expenses.length + 1 }]);
      setNewExpense({
        id: 0,
        description: '',
        category: '',
        employee: '',
        cardLastFour: '',
        date: '',
        amount: 0,
        receiptLink: '',
        consolidated: false,
      });
      setIsPopupOpen(false); // Fechar a popup após adicionar
    }
  };

  const handleEditExpense = (id: number) => {
    // Implement edit functionality
  };

  const handleDeleteExpense = async (id: number) => {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .match({ id });

    if (error) {
      console.error('Error deleting expense:', error);
    } else {
      setExpenses(expenses.filter(expense => expense.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gastos</h1>
        <button
          onClick={() => setIsPopupOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Gasto
        </button>
      </div>

      {/* Popup para Adicionar Gasto */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg mx-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">Adicionar Gasto</h2>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição do Gasto</label>
                  <input
                    type="text"
                    id="description"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoria do Gasto</label>
                  <input
                    type="text"
                    id="category"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="employee" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Empregado</label>
                  <select
                    id="employee"
                    value={newExpense.employee}
                    onChange={(e) => setNewExpense({ ...newExpense, employee: e.target.value })}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                    required
                  >
                    <option value="">Selecione um empregado</option>
                    {/* Aqui você deve mapear os empregados disponíveis */}
                    <option value="employee1">Empregado 1</option>
                    <option value="employee2">Empregado 2</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="cardLastFour" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Final do Cartão</label>
                  <input
                    type="text"
                    id="cardLastFour"
                    value={newExpense.cardLastFour}
                    onChange={(e) => setNewExpense({ ...newExpense, cardLastFour: e.target.value })}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data e Hora</label>
                  <input
                    type="datetime-local"
                    id="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor do Gasto</label>
                  <input
                    type="number"
                    id="amount"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="receiptLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Link do Comprovante</label>
                <input
                  type="url"
                  id="receiptLink"
                  value={newExpense.receiptLink}
                  onChange={(e) => setNewExpense({ ...newExpense, receiptLink: e.target.value })}
                  className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700"
                  required
                />
              </div>
              <div>
                <label htmlFor="consolidated" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Consolidado</label>
                <input
                  type="checkbox"
                  id="consolidated"
                  checked={newExpense.consolidated}
                  onChange={(e) => setNewExpense({ ...newExpense, consolidated: e.target.checked })}
                  className="mt-1"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Adicionar Gasto
                </button>
                <button
                  type="button"
                  onClick={() => setIsPopupOpen(false)}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Listagem de Gastos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Lista de Gastos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Empregado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cartão</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Comprovante</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {expenses.map(expense => (
                <tr key={expense.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{expense.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{expense.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{expense.employee}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{expense.cardLastFour}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{expense.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{expense.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a href={expense.receiptLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Download</a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button onClick={() => handleEditExpense(expense.id)} className="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400 mr-4">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDeleteExpense(expense.id)} className="text-red-600 hover:text-red-900 dark:hover:text-red-400">
                      <Trash className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
